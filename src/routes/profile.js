const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { checkEmptyRequestBody } = require("../middlewares/Validations");
const { MyError } = require("../utils/MyError");
const { User } = require("../models/user");

const profileRouter = express.Router();

// Get Profile
profileRouter.get("/Profile", userAuth, async (req, res) => {
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

// Update User using ID
profileRouter.patch(
  "/Profile/:userId",
  checkEmptyRequestBody,
  async (req, res) => {
    try {
      const userData = req.body;
      const allowedUpdates = [
        "photoUrl",
        "about",
        "skills",
        "lastName",
        "firstName",
        "gender",
      ];
      const isUpdateValid = Object.keys(userData).every((k) =>
        allowedUpdates.includes(k)
      );

      if (!isUpdateValid) {
        throw new MyError(400, "Update Failed, invalid fields!");
      }

      const userId = req.params?.userId;
      const updatedUser = await User.findByIdAndUpdate(userId, userData, {
        returnDocument: "after",
        runValidators: true,
      });
      res.send({
        message: "User updated successfully",
        user: updatedUser,
      });
    } catch (err) {
      res
        .status(err.statusCode ? err.statusCode : 500)
        .send(`ERROR: ${err.message}`);
    }
  }
);

// Delete User using ID
profileRouter.delete("/Profile", checkEmptyRequestBody, async (req, res) => {
  try {
    const userId = req.body.userId;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (deletedUser !== null) {
      res.send("User deleted successfully");
    } else {
      res.status(400).send("User does not exist");
    }
  } catch (err) {
    res
      .status(err.statusCode ? err.statusCode : 500)
      .send("ERROR: " + err.message);
  }
});

module.exports = profileRouter;
