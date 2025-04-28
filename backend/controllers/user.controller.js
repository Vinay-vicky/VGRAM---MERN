import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(401).json({
                message: "Something is missing, please check!",
                success: false,
            });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(401).json({
                message: "Try a different email",
                success: false,
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            username,
            email,
            password: hashedPassword
        });
        return res.status(201).json({
            message: "Account created successfully.",
            success: true,
        });
    } catch (error) {
        console.log(error);
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                message: "Something is missing, please check!",
                success: false,
            });
        }
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false,
            });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false,
            });
        }

        const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });

        // Populate each post in the posts array
        const populatedPosts = await Promise.all(
            user.posts.map(async (postId) => {
                const post = await Post.findById(postId);
                if (post.author.equals(user._id)) {
                    return post;
                }
                return null;
            })
        );
        user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            posts: populatedPosts
        };
        return res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000 }).json({
            message: `Welcome back ${user.username}`,
            success: true,
            user
        });

    } catch (error) {
        console.log(error);
    }
};

export const logout = async (_, res) => {
    try {
        return res.cookie("token", "", { maxAge: 0 }).json({
            message: 'Logged out successfully.',
            success: true
        });
    } catch (error) {
        console.log(error);
    }
};

export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        let user = await User.findById(userId).populate({path:'posts', createdAt:-1}).populate('bookmarks'); //select('-password'); for hiding the password. 
        return res.status(200).json({
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
};

export const editProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { bio, gender } = req.body;
        const profilePicture = req.file;
        let cloudResponse;

        if (profilePicture) {
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({
                message: 'User not found.',
                success: false
            });
        }
        if (bio) user.bio = bio;
        if (gender) user.gender = gender;
        if (profilePicture) user.profilePicture = cloudResponse.secure_url;

        await user.save();

        return res.status(200).json({
            message: 'Profile updated.',
            success: true,
            user
        });

    } catch (error) {
        console.log(error);
    }
};


export const getSuggestedUsers = async (req, res) => {
    try {
        // Get current user details
        const currentUser = await User.findById(req.id);
        if (!currentUser) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        // Get all users except the current user
        const users = await User.find({ _id: { $ne: req.id } }).select("-password");

        // Mark if the current user is already following each one
        const suggestedUsers = users.map(user => ({
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            isFollowing: currentUser.following.includes(user._id.toString())
        }));

        return res.status(200).json({
            success: true,
            users: suggestedUsers
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

// export const getSuggestedUsers = async (req, res) => {
//     try {
//         const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password");
//         if (!suggestedUsers) {
//             return res.status(400).json({
//                 message: 'Currently there are no users available.',
//             });
//         }
//         return res.status(200).json({
//             success: true,
//             users: suggestedUsers
//         });
//     } catch (error) {
//         console.log(error);
//     }
// };





export const followOrUnfollow = async (req, res) => {
    try {
        const currentUserId = req.id;
        const targetUserId = req.params.id;

        if (currentUserId === targetUserId) {
            return res.status(400).json({
                message: 'You cannot follow/unfollow yourself',
                success: false
            });
        }

        const user = await User.findById(currentUserId);
        const targetUser = await User.findById(targetUserId);

        if (!user || !targetUser) {
            return res.status(404).json({
                message: 'User not found',
                success: false
            });
        }

        const isFollowing = user.following.includes(targetUserId);

        if (isFollowing) {
            await Promise.all([
                User.findByIdAndUpdate(currentUserId, { $pull: { following: targetUserId } }),
                User.findByIdAndUpdate(targetUserId, { $pull: { followers: currentUserId } })
            ]);
        } else {
            await Promise.all([
                User.findByIdAndUpdate(currentUserId, { $addToSet: { following: targetUserId } }),
                User.findByIdAndUpdate(targetUserId, { $addToSet: { followers: currentUserId } })
            ]);
        }

        return res.status(200).json({
            success: true,
            message: isFollowing ? 'Unfollowed successfully' : 'Followed successfully',
            isFollowing: !isFollowing
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal error", success: false });
    }
};

// export const followOrUnfollow = async (req, res) => {
//     try {
//         const currentUserId = req.id;
//         const targetUserId = req.params.id;

//         if (currentUserId === targetUserId) {
//             return res.status(400).json({
//                 message: 'You cannot follow/unfollow yourself',
//                 success: false
//             });
//         }

//         const user = await User.findById(currentUserId);
//         const targetUser = await User.findById(targetUserId);

//         if (!user || !targetUser) {
//             return res.status(400).json({
//                 message: 'User not found',
//                 success: false
//             });
//         }

//         const isFollowing = user.following.includes(targetUserId);
//         if (isFollowing) {
//             // Unfollow logic
//             await Promise.all([
//                 User.updateOne({ _id: currentUserId }, { $pull: { following: targetUserId } }),
//                 User.updateOne({ _id: targetUserId }, { $pull: { followers: currentUserId } }),
//             ]);
//             return res.status(200).json({ message: 'Unfollowed successfully', success: true });
//         } else {
//             // Follow logic
//             await Promise.all([
//                 User.updateOne({ _id: currentUserId }, { $push: { following: targetUserId } }),
//                 User.updateOne({ _id: targetUserId }, { $push: { followers: currentUserId } }),
//             ]);
//             return res.status(200).json({ message: 'Followed successfully', success: true });
//         }
//     } catch (error) {
//         console.log(error);
//     }
// };













































































































// import { User } from "../models/user.model.js";
//  import bcrypt from "bcryptjs";
//  import jwt from "jsonwebtoken";
//  import getDataUri from "../utils/datauri.js";
//  import cloudinary from "../utils/cloudinary.js";
//  import { Post } from "../models/post.model.js";
//  export const register = async (req, res) => {
//      try {
//          const { username, email, password } = req.body;
//          if (!username || !email || !password) {
//              return res.status(401).json({
//                  message: "Something is missing, please check!",
//                  success: false,
//              });
//          }
//          const user = await User.findOne({ email });
//          if (user) {
//              return res.status(401).json({
//                  message: "Try different email",
//                  success: false,
//              });
//          };
//          const hashedPassword = await bcrypt.hash(password, 10);
//          await User.create({
//              username,
//              email,
//              password: hashedPassword
//          });
//          return res.status(201).json({
//              message: "Account created successfully.",
//              success: true,
//          });
//      } catch (error) {
//          console.log(error);
//      }
//  }
//  export const login = async (req, res) => {
//      try {
//          const { email, password } = req.body;
//          if (!email || !password) {
//              return res.status(401).json({
//                  message: "Something is missing, please check!",
//                  success: false,
//              });
//          }
//          let user = await User.findOne({ email });
//          if (!user) {
//              return res.status(401).json({
//                  message: "Incorrect email or password",
//                  success: false,
//              });
//          }
//          const isPasswordMatch = await bcrypt.compare(password, user.password);
//          if (!isPasswordMatch) {
//              return res.status(401).json({
//                  message: "Incorrect email or password",
//                  success: false,
//              });
//          };
 
//          const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });
 
//          // populate each post if in the posts array
//          const populatedPosts = await Promise.all(
//              user.posts.map( async (postId) => {
//                  const post = await Post.findById(postId);
//                  if(post.author.equals(user._id)){
//                      return post;
//                  }
//                  return null;
//              })
//          )
//          user = {
//              _id: user._id,
//              username: user.username,
//              email: user.email,
//              profilePicture: user.profilePicture,
//              bio: user.bio,
//              followers: user.followers,
//              following: user.following,
//              posts: populatedPosts
//          }
//          return res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000 }).json({
//              message: `Welcome back ${user.username}`,
//              success: true,
//              user
//          });
 
//      } catch (error) {
//          console.log(error);
//      }
//  };
//  export const logout = async (_, res) => {
//      try {
//          return res.cookie("token", "", { maxAge: 0 }).json({
//              message: 'Logged out successfully.',
//              success: true
//          });
//      } catch (error) {
//          console.log(error);
//      }
//  };
//  export const getProfile = async (req, res) => {
//      try {
//          const userId = req.params.id;
//          let user = await User.findById(userId).populate({path:'posts', createdAt:-1}).populate('bookmarks');
//          return res.status(200).json({
//              user,
//              success: true
//          });
//      } catch (error) {
//          console.log(error);
//      }
//  };
 
//  export const editProfile = async (req, res) => {
//      try {
//          const userId = req.id;
//          const { bio, gender } = req.body;
//          const profilePicture = req.file;
//          let cloudResponse;
 
//          if (profilePicture) {
//              const fileUri = getDataUri(profilePicture);
//              cloudResponse = await cloudinary.uploader.upload(fileUri);
//          }
 
//          const user = await User.findById(userId).select('-password');
//          if (!user) {
//              return res.status(404).json({
//                  message: 'User not found.',
//                  success: false
//              });
//          };
//          if (bio) user.bio = bio;
//          if (gender) user.gender = gender;
//          if (profilePicture) user.profilePicture = cloudResponse.secure_url;
 
//          await user.save();
 
//          return res.status(200).json({
//              message: 'Profile updated.',
//              success: true,
//              user
//          });
 
//      } catch (error) {
//          console.log(error);
//      }
//  };
//  export const getSuggestedUsers = async (req, res) => {
//      try {
//          const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password");
//          if (!suggestedUsers) {
//              return res.status(400).json({
//                  message: 'Currently do not have any users',
//              })
//          };
//          return res.status(200).json({
//              success: true,
//              users: suggestedUsers
//          })
//      } catch (error) {
//          console.log(error);
//      }
//  };
//  export const followOrUnfollow = async (req, res) => {
//      try {
//          const followKrneWala = req.id; // patel
//          const jiskoFollowKrunga = req.params.id; // shivani
//          if (followKrneWala === jiskoFollowKrunga) {
//              return res.status(400).json({
//                  message: 'You cannot follow/unfollow yourself',
//                  success: false
//              });
//          }
 
//          const user = await User.findById(followKrneWala);
//          const targetUser = await User.findById(jiskoFollowKrunga);
 
//          if (!user || !targetUser) {
//              return res.status(400).json({
//                  message: 'User not found',
//                  success: false
//              });
//          }
//          // mai check krunga ki follow krna hai ya unfollow
//          const isFollowing = user.following.includes(jiskoFollowKrunga);
//          if (isFollowing) {
//              // unfollow logic ayega
//              await Promise.all([
//                  User.updateOne({ _id: followKrneWala }, { $pull: { following: jiskoFollowKrunga } }),
//                  User.updateOne({ _id: jiskoFollowKrunga }, { $pull: { followers: followKrneWala } }),
//              ])
//              return res.status(200).json({ message: 'Unfollowed successfully', success: true });
//          } else {
//              // follow logic ayega
//              await Promise.all([
//                  User.updateOne({ _id: followKrneWala }, { $push: { following: jiskoFollowKrunga } }),
//                  User.updateOne({ _id: jiskoFollowKrunga }, { $push: { followers: followKrneWala } }),
//              ])
//              return res.status(200).json({ message: 'followed successfully', success: true });
//          }
//      } catch (error) {
//          console.log(error);
//      }
//  }