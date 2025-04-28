import React from 'react';

const PostSkeleton = () => {
  return (
    <div className="my-8 w-full max-w-[500px] mx-auto animate-pulse">
      {/* Top Profile Section */}
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-gray-300 rounded-full" /> {/* Profile image */}
          <div className="h-5 bg-gray-300 rounded w-32" /> {/* Username */}
        </div>
        <div className="w-6 h-6 bg-gray-300 rounded-full" /> {/* Options */}
      </div>

      {/* Post Image */}
      <div className="rounded-md my-4 w-full aspect-square bg-gray-300" />

      {/* Icons Section */}
      <div className="flex items-center justify-between px-4 mb-2">
        <div className="flex gap-4">
          <div className="w-7 h-7 bg-gray-300 rounded-full" />
          <div className="w-7 h-7 bg-gray-300 rounded-full" />
          <div className="w-7 h-7 bg-gray-300 rounded-full" />
        </div>
        <div className="w-7 h-7 bg-gray-300 rounded-full" />
      </div>

      {/* Likes */}
      <div className="h-4 bg-gray-300 rounded w-24 mx-4 mb-2"></div>

      {/* Caption */}
      <div className="h-4 bg-gray-300 rounded w-40 mx-4 mb-2"></div>

      {/* Comments */}
      <div className="h-4 bg-gray-300 rounded w-32 mx-4 mb-2"></div>

      {/* Add Comment Input */}
      <div className="h-10 bg-gray-300 rounded mx-4 mt-4" />
    </div>
  );
};

export default PostSkeleton;















































































// src/components/PostSkeleton.jsx

// import React from 'react';

// const PostSkeleton = () => {
//   return (
//     <div className="border p-4 rounded-md shadow animate-pulse my-6 max-w-sm mx-auto">
//       <div className="flex items-center space-x-4">
//         <div className="w-12 h-12 bg-gray-300 rounded-full" />
//         <div className="flex-1 space-y-2">
//           <div className="h-4 bg-gray-300 rounded w-1/2"></div>
//           <div className="h-4 bg-gray-300 rounded w-1/3"></div>
//         </div>
//       </div>

//       <div className="h-64 bg-gray-300 rounded my-4" />

//       <div className="space-y-2">
//         <div className="h-4 bg-gray-300 rounded w-3/4"></div>
//         <div className="h-4 bg-gray-300 rounded w-1/2"></div>
//       </div>
//     </div>
//   );
// };

// export default PostSkeleton;
