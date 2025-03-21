const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();

const USER_DATA_SAFE = [
  "firstName",
  "lastName",
  "about",
  "skills",
  "age",
  "photoUrl",
];

userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const requests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_DATA_SAFE);

    res.json({
      message: "Connections requests fetched successfully",
      data: requests,
    });
  } catch (err) {
    res
      .status(err.statusCode ? err.statusCode : 500)
      .json({ message: `ERROR: ${err.message}` });
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connections = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
      status: "accepted",
    })
      .populate("fromUserId", USER_DATA_SAFE)
      .populate("toUserId", USER_DATA_SAFE);

    const data = connections.map((conn) => {
      if (conn.fromUserId._id.equals(loggedInUser._id)) {
        return conn.toUserId;
      }
      return conn.fromUserId;
    });

    res.json({
      message: `${loggedInUser.firstName}'s connections fetched`,
      data: data,
    });
  } catch (err) {
    res
      .status(err.statusCode ? err.statusCode : 500)
      .json({ message: `ERROR: ${err.message}` });
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const pageNum = parseInt(req.query.page) || 1;
    const skip = (pageNum - 1) * limit;

    const loggedInUser = req.user;
    const existingConnectionUserIdList = await ConnectionRequest.find({
      $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const connectedUserIds = new Set();
    existingConnectionUserIdList.forEach((req) => {
      connectedUserIds.add(req.fromUserId.toString());
      connectedUserIds.add(req.toUserId.toString());
    });

    const userFeed = await User.find({
      _id: { $nin: Array.from(connectedUserIds) },
    })
      .select({
        password: 0,
        email: 0,
      })
      .skip(skip)
      .limit(limit);

    res.json({
      message: "User feed fetched",
      feed: userFeed,
    });
  } catch (err) {
    res
      .status(err.statusCode ? err.statusCode : 500)
      .json({ message: `ERROR: ${err.message}` });
  }
});

module.exports = userRouter;
