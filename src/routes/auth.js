const express = require("express");
const { validateSignupData } = require("../utils/Validations");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { MyError } = require("../utils/MyError");

const authRouter = express.Router();

// Sign up
authRouter.post("/Signup", async (req, res) => {
  try {
    validateSignupData(req);
    const { firstName, lastName, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    await user.save();
    res.send("Sign up completed");
  } catch (err) {
    res
      .status(err.statusCode ? err.statusCode : 500)
      .send(`ERROR: ${err.message}`);
  }
});

// Login Post call
authRouter.post("/Login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userDb = await User.findOne({ email: email });
    if (userDb == null) {
      throw new MyError(404, "User does not exist");
    }
    const isPasswordCorrect = await userDb.verifyPassword(password);
    if (!isPasswordCorrect) {
      throw new MyError(401, "Password is not correct");
    }

    const token = await userDb.getJwt();
    res.cookie("accessToken", token, {
      expires: new Date(Date.now() + 36000000),
    });

    res.send("Login succesfull");
  } catch (err) {
    res
      .status(err.statusCode ? err.statusCode : 500)
      .send(`ERROR: ${err.message}`);
  }
});

authRouter.post("/Logout", (req, res) => {
  res.cookie("accessToken", null, { expires: new Date(Date.now()) });
  res.send(req.customMessage ? req.customMessage : "Logged out!!");
});

module.exports = authRouter;
