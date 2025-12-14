import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import sweetRoutes from "./routes/sweetRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/sweets", sweetRoutes);

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    await mongoose.connect(mongoURI);
    console.log("connected");
  } catch (error) {
    console.error("DB Connection Failed:", error.message);
  }
};

const port = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(port);
  console.log("App is listening on port 3000");
});


export default app;
