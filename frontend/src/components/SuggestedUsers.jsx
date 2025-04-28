import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import useGetSuggestedUsers from '../hooks/useGetSuggestedUsers';
import { setSuggestedUsers } from '../redux/authSlice';  // update this based on your store

const SuggestedUsers = () => {
    const dispatch = useDispatch();
    const { loading, error } = useGetSuggestedUsers();
    const { suggestedUsers } = useSelector(state => state.auth);

    const handleFollow = async (userId) => {
        try {
            const res = await axios.post(
                `http://localhost:8000/api/v1/user/${userId}/follow`,
                {},
                { withCredentials: true }
            );

            // Update follow status in redux store
            const updatedUsers = suggestedUsers.map(user =>
                user._id === userId ? { ...user, isFollowing: res.data.isFollowing } : user
            );
            dispatch(setSuggestedUsers(updatedUsers));
        } catch (err) {
            console.error("Follow error", err);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className='my-10'>
            <div className='flex items-center justify-between text-sm'>
                <h1 className='font-semibold text-gray-600'>Suggested for you</h1>
                <span className='font-medium cursor-pointer'>See All</span>
            </div>

            {suggestedUsers.map(user => (
                <div key={user._id} className='flex items-center justify-between my-5'>
                    <div className='flex items-center gap-2'>
                        <Link to={`/profile/${user._id}`}>
                            <Avatar>
                                <AvatarImage src={user.profilePicture} alt="User" />
                                <AvatarFallback>{user?.username?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                            </Avatar>
                        </Link>
                        <div>
                            <h1 className='font-semibold text-sm'>
                                <Link to={`/profile/${user._id}`}>{user.username}</Link>
                            </h1>
                            <span className='text-gray-600 text-sm'>{user.bio || 'Bio here...'}</span>
                        </div>
                    </div>
                    <span
                        className='text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#3495d6]'
                        onClick={() => handleFollow(user._id)}
                    >
                        {user.isFollowing ? "Following" : "Follow"}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default SuggestedUsers;






























































// import React from 'react';
// import { useSelector } from 'react-redux';  // Import useSelector
// import { Link } from 'react-router-dom';
// import useGetSuggestedUsers from '../hooks/useGetSuggestedUsers';  // Import the hook
// // Import the necessary components
// import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';  // Adjust this path as per your project structure

// const SuggestedUsers = () => {
//     const { suggestedUsers } = useSelector(store => store.auth);  // Move this up before any return statements
//     const { loading, error } = useGetSuggestedUsers();  // Destructure loading and error states

//     // Show loading message or spinner if data is still being fetched
//     if (loading) {
//         return <div>Loading...</div>;
//     }

//     // Show error message if there was an issue fetching users
//     if (error) {
//         return <div>{error}</div>;
//     }

//     return (
//         <div className='my-10'>
//             <div className='flex items-center justify-between text-sm'>
//                 <h1 className='font-semibold text-gray-600'>Suggested for you</h1>
//                 <span className='font-medium cursor-pointer'>See All</span>
//             </div>
//             {
//                 suggestedUsers.map((user) => {
//                     return (
//                         <div key={user._id} className='flex items-center justify-between my-5'>
//                             <div className='flex items-center gap-2'>
//                                 <Link to={`/profile/${user?._id}`}>
//                                     <Avatar>
//                                         <AvatarImage src={user?.profilePicture} alt="post_image" />
//                                         <AvatarFallback>CN</AvatarFallback>
//                                     </Avatar>
//                                 </Link>
//                                 <div>
//                                     <h1 className='font-semibold text-sm'>
//                                         <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
//                                     </h1>
//                                     <span className='text-gray-600 text-sm'>{user?.bio || 'Bio here...'}</span>
//                                 </div>
//                             </div>
//                             <span className='text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#3495d6]'>
//                                 Follow
//                             </span>
//                         </div>
//                     );
//                 })
//             }
//         </div>
//     );
// };

// export default SuggestedUsers;

























































// import React from 'react';
// import { useSelector } from 'react-redux';  // Import useSelector
// import { Link } from 'react-router-dom';
// import useGetSuggestedUsers from '../hooks/useGetSuggestedUsers';  // Import the hook

// const SuggestedUsers = () => {
//     const { suggestedUsers } = useSelector(store => store.auth);  // Move this up before any return statements
//     const { loading, error } = useGetSuggestedUsers();  // Destructure loading and error states

//     // Show loading message or spinner if data is still being fetched
//     if (loading) {
//         return <div>Loading...</div>;
//     }

//     // Show error message if there was an issue fetching users
//     if (error) {
//         return <div>{error}</div>;
//     }

//     return (
//         <div className='my-10'>
//             <div className='flex items-center justify-between text-sm'>
//                 <h1 className='font-semibold text-gray-600'>Suggested for you</h1>
//                 <span className='font-medium cursor-pointer'>See All</span>
//             </div>
//             {
//                 suggestedUsers.map((user) => {
//                     return (
//                         <div key={user._id} className='flex items-center justify-between my-5'>
//                             <div className='flex items-center gap-2'>
//                                 <Link to={`/profile/${user?._id}`}>
//                                     <Avatar>
//                                         <AvatarImage src={user?.profilePicture} alt="post_image" />
//                                         <AvatarFallback>CN</AvatarFallback>
//                                     </Avatar>
//                                 </Link>
//                                 <div>
//                                     <h1 className='font-semibold text-sm'>
//                                         <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
//                                     </h1>
//                                     <span className='text-gray-600 text-sm'>{user?.bio || 'Bio here...'}</span>
//                                 </div>
//                             </div>
//                             <span className='text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#3495d6]'>
//                                 Follow
//                             </span>
//                         </div>
//                     );
//                 })
//             }
//         </div>
//     );
// };

// export default SuggestedUsers;




























































// import React from 'react'
// import { useSelector } from 'react-redux'
// import { Link } from 'react-router-dom';
// import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

// const SuggestedUsers = () => {
//     const { suggestedUsers } = useSelector(store => store.auth);
//     return (
//         <div className='my-10'>
//             <div className='flex items-center justify-between text-sm'>
//                 <h1 className='font-semibold text-gray-600'>Suggested for you</h1>
//                 <span className='font-medium cursor-pointer'>See All</span>
//             </div>
//             {
//                 suggestedUsers.map((user) => {
//                     return (
//                         <div key={user._id} className='flex items-center justify-between my-5'>
//                             <div className='flex items-center gap-2'>
//                                 <Link to={`/profile/${user?._id}`}>
//                                     <Avatar>
//                                         <AvatarImage src={user?.profilePicture} alt="post_image" />
//                                         <AvatarFallback>CN</AvatarFallback>
//                                     </Avatar>
//                                 </Link>
//                                 <div>
//                                     <h1 className='font-semibold text-sm'><Link to={`/profile/${user?._id}`}>{user?.username}</Link></h1>
//                                     <span className='text-gray-600 text-sm'>{user?.bio || 'Bio here...'}</span>
//                                 </div>
//                             </div>
//                             <span className='text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#3495d6]'>Follow</span>
//                         </div>
//                     )
//                 })
//             }

//         </div>
//     )
// }

// export default SuggestedUsers