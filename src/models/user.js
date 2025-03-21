const mongoose = require("mongoose");
const { MyError } = require("../utils/MyError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
    },
    lastName: {
      type: String,
      maxLength: 50,
    },
    age: {
      type: Number,
      min: 13,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      match: /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/,
    },
    password: {
      type: String,
      required: true,
      minLength: 4,
    },
    gender: {
      type: String,
      enum: {
        values: ["Male", "Female", "Others"],
        message: `{VALUES} gender type is not valid`,
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg",
    },
    about: {
      type: String,
      default: "This is a Demo about for the User",
    },
    skills: {
      type: [String],
      validate(value) {
        if (value.lenght > 5) {
          throw new MyError(422, "Skills should not be more than 5");
        }
      },
    },
  },
  { timestamps: true }
);

userSchema.methods.getJwt = async function () {
  const token = await jwt.sign({ _id: this._id }, "adarshdubey", {
    expiresIn: "1h",
  });
  return token;
};

userSchema.methods.verifyPassword = async function (inputPassword) {
  const isPasswordValid = await bcrypt.compare(inputPassword, this.password);
  return isPasswordValid;
};

userSchema.methods.getPasswordHash = async function (password) {
  const hashPassword = await bcrypt.hash(password, 10);
  return hashPassword;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
