const validator = require("validator");
const { MyError } = require("./MyError");

const validateSignupData = (req) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName) {
    throw new MyError(400, "Please provide name correctly!");
  }
  if (!email || !validator.isEmail(email)) {
    throw new MyError(400, "Email is not valid!");
  }
  if (!password) {
    throw new MyError(400, "Please provide a password");
  }
};

const validateConnectionRequest = (req) => {
  const { toUser } = req.body;
  if (!toUser) {
    throw new MyError(400, "Invalid request");
  }
};

module.exports = { validateSignupData, validateConnectionRequest };
