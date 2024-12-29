const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const cors = require("cors");
const Authenticate = require("../middleware/userAuth");

require("../db/conn");
const User = require("../model/userSchema");

router.use(cors());

router.get("/", (req, res) => {
  res.send("This is Home page by router");
});

// Signin up API

router.post("/user-signup", async (req, res) => {
  const { name, email, number, password, cpassword } = req.body;

  if (!name || !email || !number || !password || !cpassword) {
    return res.status(422).json({ error: "Please fill in all fields" });
  }

  try {
    const userExist = await User.findOne({ email: email });

    if (userExist) {
      return res.status(422).json({ error: "Email Already Exists" });
    } else if (password !== cpassword) {
      return res.status(422).json({ error: "Passwords do not match" });
    } else {
      const newUser = new User({ name, email, number, password, cpassword });

      await newUser.save();

      res.status(201).json({ message: "Registration Successful" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Signin API

router.post("/user-signin", async (req, res) => {
  try {
    let tokan;
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Please Fill all the Fields" });
    }

    const UserLogin = await User.findOne({ email: email });

    if (UserLogin) {
      const UserPassword = await bcrypt.compare(password, UserLogin.password);

      // JWT tokan
      tokan = await UserLogin.generateAuthToken();
      console.log(tokan);

      // store tokan in cookies
      res.cookie("userTokan", tokan, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true,
      });

      if (!UserPassword) {
        res.status(400).json({ error: "Invalid Credentials" });
      } else {
        res.json({ error: "User Signin Successfully" });
      }
    } else {
      res.status(400).json({ error: "Invalid Credentials" });
    }
  } catch (err) {
    console.log(err);
  }
});

router.get("/user-dashboard", Authenticate, (req, res) => {
  console.log("This is home page");
  res.send(req.rootUser);
});



// Logout API
router.get("/user-logout", async (req, res) => {
  try {
    res.clearCookie("jwtokan", { path: "/" });
    res.clearCookie("userToken", { path: "/" });
    res.status(200).send("User Logout");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;
