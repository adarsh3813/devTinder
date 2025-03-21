const validator = require("validator");
const { MyError } = require("./MyError");

let checkEmptyRequestBody = (req) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return true;
  }
  return false;
};

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

const validateProfileUpdateData = (req) => {
  if (checkEmptyRequestBody(req)) {
    return false;
  }
  const allowedUpdates = [
    "photoUrl",
    "about",
    "skills",
    "lastName",
    "firstName",
    "gender",
    "age",
  ];
  const isUpdateValid = Object.keys(req.body).every((k) =>
    allowedUpdates.includes(k)
  );
  return isUpdateValid;
};

module.exports = {
  validateSignupData,
  validateProfileUpdateData,
};
