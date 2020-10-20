const createError = require("http-errors");
const UserCamp = require("../models/usercamp.model");

module.exports.show = (req, res, next) => {
  UserCamp.find({ useId: req.currenUser.id })
    .then((camps) => res.status(200).json(camps))
    .catch(next);
};
