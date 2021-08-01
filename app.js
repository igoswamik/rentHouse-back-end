require("dotenv").config({ path: "./config.env" });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Housepost = require("./models/housepost");
const Review = require("./models/review");
const errorHandler = require("./middleware/error");

const connectDB = require("./config/db");
//connect DB
connectDB();

// const dbUrl = process.env.MONGO_URI || "mongodb://localhost:27017/rent-house";
// mongoose.connect(dbUrl, {
//   useNewUrlParser: true,
//   useCreateIndex: true,clear
//   useUnifiedTopology: true,
//   useFindAndModify: false,
// });

// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", () => {
//   console.log("Database Connected!");
// });

const app = express();

app.use(cors());
app.use(express.json()); //middleware that allows us to get data from body i.e req.body
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", require("./routes/auth")); //any api starting with /api/auth will be redirected to auth route

app.get("/", (req, res) => {
  res.send("Server Home");
});

app.post("/createpost", async (req, res) => {
  const houseData = req.body;
  const house = new Housepost(houseData);
  await house.save();
  res.send(house);
});

app.get("/allposts", async (req, res) => {
  const posts = await Housepost.find({});
  res.send(posts);
});
app.get("/post/:id", async (req, res) => {
  const house = await Housepost.findById(req.params.id).populate("reviews"); //populating reviews of this house post;
  res.send(house);
});
app.put("/post/:id", async (req, res) => {
  console.log(req.body);
  const house = await Housepost.findByIdAndUpdate(req.params.id, req.body);
  res.status(200).send(house);
});
app.delete("/post/:id", async (req, res) => {
  console.log(req.body);
  await Housepost.findByIdAndDelete(req.params.id);
  res.status(200).send("Deleted!!!!");
});
app.post("/user/new", async (req, res) => {
  const userData = req.body;
  res.send("got");
});
app.post("/post/:id/createreview", async (req, res) => {
  console.log(req.params.id);
  console.log(req.body);
  const house = await Housepost.findById(req.params.id);
  const review = new Review(req.body);

  // review.author=req.user._id;
  house.reviews.push(review);
  await review.save();
  await house.save();
  console.log("new house=", house);
  console.log("new review=", review);
  res.send(review);
});
app.delete("/post/:id/:reviewId", async (req, res) => {
  const { id, reviewId } = req.params;
  await Housepost.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); //pull is mongo way of deleting fron array
  await Review.findByIdAndDelete(reviewId);
  res.send("deleted review");
});

/*************Error Handler (should be last peice of middleware) *****************/
app.use(errorHandler);

const PORT = process.env.PORT || 8081;
const server = app.listen(PORT, () => {
  console.log("server listning on port", PORT);
});

process.on("unhandledRejection", (err, promise) => {
  console.log(`Logged error: ${err}`);
  server.close(() => process.exit(1));
});
