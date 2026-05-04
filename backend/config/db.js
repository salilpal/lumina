const mongoose = require("mongoose");

const connectDB = async () => {
  mongoose
    .connect(process.env.mongodbURI)
    .then(() => console.log("mongodb connected"))
    .catch((err) => console.error(err.message));
};

module.exports = connectDB;
