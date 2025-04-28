import React, { useState, useEffect } from 'react';
import Post from './Post';
import { useSelector } from 'react-redux';
import PostSkeleton from './PostSkeleton'; // import the skeleton loader

const Posts = () => {
  const { posts } = useSelector(store => store.post);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading delay (you can replace with your real API loading state later)
    if (posts.length > 0) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000); // 1 second delay for smoother UX

      return () => clearTimeout(timer);
    } else {
      setLoading(false);
    }
  }, [posts]);

  return (
    <div>
      {
        loading ? (
          <>
            {[...Array(3)].map((_, index) => (
              <PostSkeleton key={index} />
            ))}
          </>
        ) : (
          posts.length > 0 ? (
            posts.map((post) => <Post key={post._id} post={post} />)
          ) : (
            <p className="text-center text-gray-400 mt-10">No posts to show.</p>
          )
        )
      }
    </div>
  );
};

export default Posts;

















































// import React from 'react'
// import Post from './Post'
// import { useSelector } from 'react-redux'

// const Posts = () => {
//   const {posts} = useSelector(store=>store.post);
//   return (
//     <div>
//         {
//             posts.map((post) => <Post key={post._id} post={post}/>)
//         }
//     </div>
//   )
// }

// export default Posts