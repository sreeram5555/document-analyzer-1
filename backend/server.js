// import express from 'express';
// import cors from 'cors';
// import bodyParser from 'body-parser';
// import mongoose from 'mongoose';    
// import dotenv from 'dotenv';
// import authRoutes from './routes/authRoutes.js';


// dotenv.config();

// const server = express();
// const PORT = process.env.PORT || 5000;

// server.get('/', (req, res) => {
//     res.send('Hello, World!');
// });

// server.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });


import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
// import userRoutes from "./routes/userRoutes.js";


dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
// app.use("/api/user", userRoutes);


app.get("/", (req, res) => res.send("Server running 🚀"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
