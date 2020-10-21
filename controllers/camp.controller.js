const createError = require("http-errors");
const Camp = require("../models/camp.model");

module.exports.all = (req, res, next) => {
  Camp.find({})
    .then((camps) => res.status(200).json(camps))
    .catch(next);
};

module.exports.new = (req, res, next) => {
  const { name, edition, description, image, dateStart, dateEnd } = req.body;
  const camp = new Camp({
    name: name,
    edition: edition,
    description: description,
    image: req.file ? req.file.url : image,
    dateStart: dateStart,
    dateEnd: dateEnd,
  });

  camp
    .save()
    .then((camp) => res.status(201).json(camp))
    .catch(next);
};

module.exports.show = (req, res, next) => {
  const { id } = req.params;
  Camp.findById(id)
    .then((camp) => res.status(200).json(camp))
    .catch(next);
};
module.exports.edit = (req, res, next) => {
  const { id } = req.params;
  if (req.file) {
    req.body.image = req.file.url;
  }
  Camp.findByIdAndUpdate(id, req.body)
    .then((camp) => res.status(200).json(camp))
    .catch(next);
};

module.exports.delete = (req, res, next) => {
  const { id } = req.params;
  Camp.findByIdAndDelete(id)
    .then(() => {
      res.status(204).json();
    })
    .catch(next);
};
