const express = require("express");
const mongoose = require("mongoose");
const users = require("./routes/api/users");
const posts = require("./routes/api/posts");
const profile = require("./routes/api/profile");
const bodyParser = require("body-parser");
const app = express();

// Body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB config
const { mongoURI } = require("./config/keys.js");

// Connect to DB
mongoose
  .connect(mongoURI)
  .then(() => console.log("Connected to DB."))
  .catch((e) => console.log("Unable to connect to DB . error : ", e));

app.get("/", (req, res) => res.send("hello"));

app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on ${port}`));
