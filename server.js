const express = require("express");
const mongoose = require("mongoose");
const { mongoURI } = require("./config/keys.js");
const app = express();

mongoose
  .connect(mongoURI)
  .then(() => console.log("Connected to DB."))
  .catch(e => console.log("Unable to connect to DB . error : ", e));

app.get("/", (req, res) => res.send("hello"));
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on ${port}`));
