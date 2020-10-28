const Content = require("../models/content.model");

module.exports.all = (req, res, next) => {
  Content.find({})
    .populate("courseId")
    .populate("monitorId")
    .populate("attachments")
    .then((content) => res.status(200).json(content))
    .catch(next);
};

module.exports.new = (req, res, next) => {
  if (req.file) {
    req.body.image = req.file.url;
  }
  const content = new Content(req.body);
  content
    .save()
    .then((content) => res.status(201).json(content))
    .catch(next);
};

module.exports.show = (req, res, next) => {
  const { id } = req.params;
  Content.findById(id)
    .populate("courseId")
    .populate("monitorId")
    .then((content) => res.status(200).json(content))
    .catch(next);
};

module.exports.edit = (req, res, next) => {
  const { id } = req.params;
  if (req.file) {
    req.body.image = req.file.url;
  }
  Content.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
    .then((content) => res.status(200).json(content))
    .catch(next);
};

module.exports.delete = (req, res, next) => {
  const { id } = req.params;
  Content.findByIdAndDelete(id)
    .then(() => {
      res.status(204).json();
    })
    .catch(next);
};
