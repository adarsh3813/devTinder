const mongoose = require("mongoose");
const { MyError } = require("../utils/MyError");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      require: false,
      ref: "User",
    },
    status: {
      type: String,
      enum: {
        values: ["accepted", "ignored", "interested", "rejected"],
        message: `{VALUE} is not an accepted status option`,
      },
      required: true,
    },
  },
  { timestamps: true }
);

connectionRequestSchema.pre("save", function (next) {
  if (this.fromUserId.equals(this.toUserId)) {
    return next(new MyError(400, "Cannot send request to yourself"));
  }
  next();
});

const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequest;
