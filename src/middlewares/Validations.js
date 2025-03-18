let checkEmptyRequestBody = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    res.status(400).send("Invalid Request");
  } else {
    next();
  }
};

module.exports = { checkEmptyRequestBody };
