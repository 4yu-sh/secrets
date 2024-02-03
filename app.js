require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { exists } = require("fs");
const app = express();
const bcrypt = require("bcrypt");
app.use(express.static("public"));

const saltrounds = 10;

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDb");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = new mongoose.model("user", userSchema);

app.get("/", function (req, res) {
  res.render("home");
});
app.get("/login", function (req, res) {
  res.render("login");
});
app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", function (req, res) {
  userAdd();
  async function userAdd() {
    bcrypt.hash(req.body.password, saltrounds, function (err, hash) {
      const newUser = new User({
        email: req.body.username,
        password: hash,
      });
      newUser.save();
      res.render("secrets");
    });
  }
});

app.post("/login", function (req, res) {
  userCheck();
  async function userCheck() {
    const email = req.body.username;
    const password = req.body.password; //this still works withou using bcrypt & it was the same for the md5 hashing and also mongoose encrption.

    User.exists({ email: email }, { password: password }).then((exists) => {
      if (exists) {
        res.render("secrets");
      } else {
        res.render("login");
      }
    });
  }
});

app.listen("3000", function () {
  console.log("Running on port 3000");
});
