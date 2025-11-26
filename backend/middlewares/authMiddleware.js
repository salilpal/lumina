// middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // console.log("Authorization header:", req.headers.authorization);
      // console.log("Extracted token:", token);

      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" }); // ✅ RETURN
      }

      return next(); // ✅ Only call next once, and safely
    } catch (error) {
      console.error("JWT Error:", error);
      return res.status(401).json({ message: "Not authorized, token failed" }); // ✅ RETURN
    }
  }

  return res.status(401).json({ message: "Not authorized, no token" }); // ✅ RETURN
};

module.exports = { protect };
