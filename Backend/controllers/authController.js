import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log("Incoming data:", req.body);

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const adminList = process.env.ADMIN_EMAILS?.split(",") || [];
    const role = adminList.includes(email) ? "admin" : "user";

    const newUser = await User.create({
      name,
      email,
      password: hashed,
      role,
    });

    return res.status(201).json({
      message: "Registered successfully",
      role: newUser.role,
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) return res.status(400).json({ message: "Incorrect password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    res.json({
      token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    return res.status(500).json({ message: "Server error"+ err.message });
  }
};
