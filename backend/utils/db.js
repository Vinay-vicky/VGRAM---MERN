import mongoose from "mongoose";
 
 const connectDB = async () => {
     try {
         await mongoose.connect(process.env.MONGO_URI);
         console.log('mongodb connected successfully.');
     } catch (error) {
         console.log(error);
     }
 }
 export default connectDB;






// db.js
// import mongoose from "mongoose";

// const connectDB = async () => {
//     try {
//         await mongoose.connect(process.env.MONGO_URI);
//         console.log("MongoDB connected successfully.");
//     } catch (error) {
//         console.error("DB connection error:", error);
//     }
// };

// export default connectDB;
