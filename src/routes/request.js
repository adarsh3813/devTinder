const express = require("express");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const { MyError } = require("../utils/MyError");

const requestRouter = express.Router();

// Send connection request
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const { status, toUserId } = req.params;
      const loggedInUser = req.user;
      const fromUserId = loggedInUser._id;

      const allowedStates = ["interested", "ignored"];
      if (!allowedStates.includes(status)) {
        throw new MyError(400, `${status} is not allowed`);
      }

      const toUser = await User.findById(toUserId).exec();

      if (!toUser) {
        throw new MyError(404, "User not found");
      }

      const isDuplicateConnection = await ConnectionRequest.findOne({
        $or: [
          { fromUserId: fromUserId, toUserId: toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (isDuplicateConnection) {
        throw new MyError(400, "Duplicate connection request");
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const savedConnectionRequest = await connectionRequest.save();

      res.send({
        message: `Connection request for ${status} received`,
        data: savedConnectionRequest,
      });
    } catch (err) {
      res
        .status(err.statusCode ? err.statusCode : 500)
        .send("ERROR:" + err.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      const allowesStatus = ["accepted", "rejected"];
      if (!allowesStatus.includes(status)) {
        throw new MyError(400, "Invalid request");
      }
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        throw new MyError(404, "Connection request not found");
      }

      connectionRequest.status = status;
      await connectionRequest.save();

      res.json({
        message: "Connection request " + status,
        data: connectionRequest,
      });
    } catch (err) {
      res
        .status(err.statusCode ? err.statusCode : 500)
        .json({ message: "ERROR:" + err.message });
    }
  }
);

module.exports = requestRouter;
