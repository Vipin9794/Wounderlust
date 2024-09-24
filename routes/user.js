const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ username, email,password });
      const registerUser = await User.register(newUser, password);
      console.log(registerUser);
      req.flash("success", "user was registered successfully");
      res.redirect("/listings");
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  }),
);

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post(
  "/login ",
  passport.authenticate("local ", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    res.send("Wellcom to the Wonderlust");
  }
);

module.exports = router;
