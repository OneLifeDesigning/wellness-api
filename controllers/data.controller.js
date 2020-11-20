const createError = require("http-errors");
const Data = require("../models/data.model");

module.exports.create = (req, res, next) => {
  const { date, hours, consumition, price, cost } = req.body;
  if (!date && !hours && !consumition && !price && !cost) {
    throw createError(400, "All inputs is required");
  }

  const data = new Data(req.body);
  data
    .save()
    .then((data) => {
      res.status(201).json(data);
    })
    .catch(next);
};

module.exports.readAll = (req, res, next) => {
  Data.find({})
    .sort({ date: -1 })
    .then((data) => res.status(200).json(data))
    .catch(next);
};

module.exports.read = (req, res, next) => {
  Data.findById(req.params.id)
    .then((data) => res.status(200).json(data))
    .catch(next);
};

module.exports.update = (req, res, next) => {
  Data.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.status(200).json(user))
    .catch(next);
};

module.exports.delete = (req, res, next) => {
  Data.findByIdAndDelete(req.params.id)
    .then((user) => res.status(204).json())
    .catch(next);
};
