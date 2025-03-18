const express = require("express");
const { connectDb } = require("./config/database");
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

connectDb()
  .then(() => {
    console.log("Db Connection established!");
    app.listen(3000, () => console.log("Server listening on port 3000"));
  })
  .catch((err) => {
    console.error(err);
  });
