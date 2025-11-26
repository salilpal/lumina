// routes/authRoutes.js
const express = require("express");
const {
  registerUser,
  loginUser,
  getMe,
} = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);

const passport = require("passport");

const { checkEmailExists } = require("../controllers/authController");

// Google login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  (req, res) => {
    const { token, user } = req.user;

    // Redirect to frontend with token
    res.redirect(`http://localhost:5173/login-success?token=${token}`);
  }
);

router.post('/check-email', checkEmailExists);

module.exports = router;
