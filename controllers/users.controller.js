const User = require("../models/user.model");
const createError = require("http-errors");

module.exports.all = (_, res, next) => {
  User.find()
    .then((users) => res.status(200).json(users))
    .catch(next);
};
