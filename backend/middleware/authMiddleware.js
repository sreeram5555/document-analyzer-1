import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

// No changes are needed in this file, but it's important to know it's being used.
const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ detail: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // This line attaches the user's data to the request object
    req.user = await userModel.findById(decoded.id).select("-password");
    
    if (!req.user) {
        return res.status(401).json({ detail: "User not found." });
    }

    next();
  } catch (err) {
    res.status(401).json({ detail: "Invalid token" });
  }
};

export default userAuth;