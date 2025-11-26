// middlewares/roleMiddleware.js
const adminOnly = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Access denied: Admins only" });
  }
};

// alias for adminOnly if you need named 'isAdmin'
const isAdmin = adminOnly;

module.exports = { adminOnly, isAdmin };
