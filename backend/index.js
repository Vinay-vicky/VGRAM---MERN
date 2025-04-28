import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js";

dotenv.config({});
const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (_,res) => {
    return res.status(200).json({
        message: "I'm coming from backend",
        success:true
    })
})
//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({extended:true}));
const corsOptions = {
    origin:'http://localhost:5173',
    credentials:true
}
app.use(cors(corsOptions));


// Our APIs will come here
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);


app.listen(PORT, () => {
    connectDB();
    console.log(`server listen at port ${PORT}`);
});





































































// index.js (or server.js)
// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import dotenv from "dotenv";
// import connectDB from "./utils/db.js";

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 3000;

// // ✅ Middleware setup (should come before routes)
// app.use(express.json());
// app.use(cookieParser());
// app.use(express.urlencoded({ extended: true }));

// const corsOptions = {
//     origin: "http://localhost:5173",
//     credentials: true  // ✅ lowercase 'credentials'
// };

// app.use(cors(corsOptions));

// // ✅ Basic route
// app.get("/", (_, res) => {
//     return res.status(200).json({
//         message: "I'm coming from backend",
//         success: true
//     });
// });

// // ✅ Start server only after DB connects
// connectDB().then(() => {
//     app.listen(PORT, () => {
//         console.log(`Server listening at port ${PORT}`);
//     });
// });
