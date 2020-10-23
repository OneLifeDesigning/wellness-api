const Attachment = require("../models/attachment.model");

module.exports.all = (req, res, next) => {
  Attachment.find({})
    .then((attachments) => res.status(200).json(attachments))
    .catch(next);
};

module.exports.new = (req, res, next) => {
  req.body.parentId = req.params.parentId;

  if (req.file) {
    req.body.image = req.file.url;
  }

  const attachment = new Attachment(req.body);

  attachment
    .save()
    .then((attachment) => res.status(201).json(attachment))
    .catch(next);
};

module.exports.show = (req, res, next) => {
  Attachment.findById(req.params.id)
    .populate({
      path: "courses",
      model: "Course",
    })
    .then((attachment) => res.status(200).json(attachment))
    .catch(next);
};
module.exports.edit = (req, res, next) => {
  if (req.file) {
    req.body.image = req.file.url;
  }

  Attachment.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((attachment) => res.status(200).json(attachment))
    .catch(next);
};

module.exports.delete = (req, res, next) => {
  Attachment.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).json();
    })
    .catch(next);
};
