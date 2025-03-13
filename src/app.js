const express = require("express");

const app = express();

app.use("/hello", (req, res) => {
  res.send("Hello from server!!");
});

app.use("/secret", (req, res) => {
  res.send("Secret route unlocked!!");
});

app.listen(3000, () => console.log("Server listening on port 3000"));
