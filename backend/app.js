const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
// const xss = require("xss-clean");
// const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/errorHandler");

dotenv.config();

connectDB();

require("./config/passport");

const app = express();

// -------- Security Middlewares --------
app.use(helmet()); // sets secure HTTP headers
// app.use(xss()); // sanitize user input
// app.use(mongoSanitize()); // prevent NoSQL injection
app.use(hpp()); // prevent HTTP param pollution

// -------- Rate Limiting --------
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests
  message: "Too many requests from this IP. Try again later.",
});
app.use(limiter);

// -------- Basic Middlewares --------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -------- Routes --------
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/types", require("./routes/typeRoutes"));
app.use("/api/products", require("./routes/productRoutes"));

app.get("/", (req, res) => res.send("API is working ✅"));

// -------- Error Handler --------
app.use(errorHandler);

module.exports = app;
