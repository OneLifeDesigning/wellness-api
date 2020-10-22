const createError = require("http-errors");

module.exports.show = (req, res, next) => {
  res.status(200).json("Home");
};
