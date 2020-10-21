const Course = require("../models/course.model");

module.exports.all = (req, res, next) => {
  Course.find({})
    .then((courses) => res.status(200).json(courses))
    .catch(next);
};

module.exports.new = (req, res, next) => {
  if (req.file) {
    req.body.image = req.file.url;
  }
  const course = new Course(req.body);
  course
    .save()
    .then((course) => res.status(201).json(course))
    .catch(next);
};

module.exports.show = (req, res, next) => {
  const { id } = req.params;
  Course.findById(id)
    .then((course) => res.status(200).json(course))
    .catch(next);
};
module.exports.edit = (req, res, next) => {
  const { id } = req.params;
  if (req.file) {
    req.body.image = req.file.url;
  }
  Course.findByIdAndUpdate(id, req.body)
    .then((course) => res.status(200).json(course))
    .catch(next);
};

module.exports.delete = (req, res, next) => {
  const { id } = req.params;
  Course.findByIdAndDelete(id)
    .then(() => {
      res.status(204).json();
    })
    .catch(next);
};
