const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { MyError } = require("../utils/MyError");
const { validateProfileUpdateData } = require("../utils/Validations");

const profileRouter = express.Router();

// Get Profile
profileRouter.get("/Profile/view", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    res.send({
      message: `Welcome ${loggedInUser.firstName}`,
      info: loggedInUser,
    });
  } catch (err) {
    res
      .status(err.statusCode ? err.statusCode : 500)
      .send(`ERROR: ${err.message}`);
  }
});

// Update Profile of logged in User
profileRouter.patch("/Profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileUpdateData(req)) {
      throw new MyError(400, "Invalid update request!");
    }
    const userUpdateRequestData = req.body;
    const loggedInUser = req.user;

    Object.keys(userUpdateRequestData).forEach(
      (key) => (loggedInUser[key] = userUpdateRequestData[key])
    );
    await loggedInUser.save();

    res.send({
      message: `${loggedInUser.firstName}'s profile has been updated successfully`,
      details: loggedInUser,
    });
  } catch (err) {
    res
      .status(err.statusCode ? err.statusCode : 500)
      .send(`ERROR: ${err.message}`);
  }
});

profileRouter.patch("/Profile/updatePassword", userAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const loggedInUser = req.user;

    isOldPasswordCorrect = await loggedInUser.verifyPassword(oldPassword);
    if (!isOldPasswordCorrect) {
      throw new MyError("You Passoword is incorrect!");
    }
    loggedInUser.password = await loggedInUser.getPasswordHash(newPassword);
    await loggedInUser.save();
    res.send({ message: "Password has been updated!" });
  } catch (err) {
    res
      .status(err.statusCode ? err.statusCode : 500)
      .send("ERROR: " + err.message);
  }
});

// Delete Profile of logged in User
profileRouter.delete("/Profile/delete", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    await loggedInUser.deleteOne();
    req.customMessage = "Your Profile is deleted. You are being logged out!!";
    res.status(301).redirect("/Profile/Logout");
  } catch (err) {
    res
      .status(err.statusCode ? err.statusCode : 500)
      .send("ERROR: " + err.message);
  }
});

module.exports = profileRouter;
