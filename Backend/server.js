import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();

app.use(cors());
app.use(express.json());


import sweetRoutes from "./routes/sweetRoutes";
import authRoutes from "./routes/authRoutes";

app.use("/api/auth", authRoutes);
app.use("/api/sweets", sweetRoutes);

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

const connectDB = async () => {
  try {
    const mongoURI =
  process.env.NODE_ENV === "test"
    ? "mongodb://127.0.0.1:27017/sweetshop_test"
    : process.env.MONGO_URI;

await mongoose.connect(mongoURI);
console.log("CONNECTED TO:", mongoURI);

    console.log("MongoDB Connected");
  } catch (error) {
    console.error("DB Connection Failed:", error);
    process.exit(1);
  }
};

export default app;

if (process.env.NODE_ENV !== "test") {
  const port = process.env.PORT || 3000;
  connectDB().then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  });
}
