const mongoose = require("mongoose");
const dbUrl = process.env.MONGO_URI || "mongodb://localhost:27017/rent-house";

const connectDB = async () => {
  await mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
  });

  console.log("MongoDB Database Connected");
  //   const db = mongoose.connection;
  //   db.on("error", console.error.bind(console, "connection error:"));
  //   db.once("open", () => {
  //     console.log("Database Connected!");
  //   });
};

module.exports = connectDB;
