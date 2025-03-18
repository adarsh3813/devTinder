const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://adarshdubey444:adarshdubey444@namastenodecourse.4ao0t.mongodb.net/devTinder"
  );
};

module.exports = { connectDb };
