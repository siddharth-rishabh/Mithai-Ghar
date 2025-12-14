import jwt from "jsonwebtoken";
import User from "../models/user";

export const protect = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer")) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");

    next();

  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
