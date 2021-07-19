const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const Housepost = require("./models/housepost");
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/rent-house";
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database Connected!");
});

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("Server Home");
});

app.post("/createpost", async (req, res) => {
  const houseData = req.body;
  //   console.log("houseData=", houseData);
  //   res.send(houseData);

  const house = new Housepost(houseData);
  await house.save();
  res.send(house);
});

app.get("/allposts", async (req, res) => {
  const posts = await Housepost.find({});
  res.send(posts);
});
app.get("/post/:id", async (req, res) => {
  const house = await Housepost.findById(req.params.id);
  res.send(house);
});

app.listen(8081, () => {
  console.log("server listning on port 8080");
});
