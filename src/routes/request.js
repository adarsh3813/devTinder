const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateConnectionRequest } = require("../utils/Validations");

const requestRouter = express.Router();

// Send connection request
requestRouter.post("/sendConnectionRequest", userAuth, (req, res) => {
  try {
    validateConnectionRequest(req);
    const loggedInUser = req.user;
    const { toUser } = req.body;
    res.send({
      message: "Connection request sent!",
      details: { fromUser: loggedInUser.email, toUser: toUser },
    });
  } catch (err) {
    res
      .status(err.statusCode ? err.statusCode : 500)
      .send("ERR: " + err.message);
  }
});

module.exports = requestRouter;
