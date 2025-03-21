const jwt = require("jsonwebtoken");
const { MyError } = require("../utils/MyError");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { accessToken } = req.cookies;

    if (!accessToken) {
      throw new MyError(401, "Unautorized request");
    }

    const decodedObj = jwt.verify(accessToken, "adarshdubey");
    const { _id } = decodedObj;
    const userDb = await User.findById(_id).exec();

    if (!userDb) {
      throw new MyError(404, "User not found. Please login again!");
    }

    req.user = userDb;
    next();
  } catch (err) {
    res
      .status(err.statusCode ? err.statusCode : 500)
      .send(`ERR: ${err.message}`);
  }
};

module.exports = { userAuth: userAuth };
