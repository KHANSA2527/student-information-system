import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";


const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] || req.query.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token not provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user exists in the system
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // // Check if the user is blocked
    // if (user.is_blocked) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Your account has been suspended due to violation of Community Guidelines",
    //   });
    // }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    } else {
      console.error("Error in authentication middleware:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
};

export { authMiddleware };