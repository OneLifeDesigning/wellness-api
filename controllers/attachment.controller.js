const Attachment = require("../models/attachment.model");
const AttachmentCourse = require("../models/attachment.course.model");
const AttachmentCamp = require("../models/attachment.camp.model");
const AttachmentLesson = require("../models/attachment.lesson.model");

module.exports.all = (req, res, next) => {
  Attachment.find({})
    .then((attachments) => res.status(200).json(attachments))
    .catch(next);
};

module.exports.newAtachmentCourse = (req, res, next) => {
  if (req.file) {
    req.body.image = req.file.url;
  }

  const attachment = new Attachment(req.body);

  attachment
    .save()
    .then((attachment) => {
      const attachmentCourse = new AttachmentCourse({
        attachmentId: attachment.id,
        courseId: req.params.id,
      });
      attachmentCourse
        .save()
        .then(() => res.status(201).json(attachment))
        .catch(next);
    })
    .catch(next);
};

module.exports.show = (req, res, next) => {
  const { id } = req.params;
  Attachment.findById(id)
    .populate({
      path: "courses",
      model: "Course",
    })
    .then((attachment) => res.status(200).json(attachment))
    .catch(next);
};
module.exports.edit = (req, res, next) => {
  const { id } = req.params;
  if (req.file) {
    req.body.image = req.file.url;
  }
  Attachment.findByIdAndUpdate(id, req.body, { new: true })
    .then((attachment) => res.status(200).json(attachment))
    .catch(next);
};

module.exports.delete = (req, res, next) => {
  const { id } = req.params;
  Attachment.findByIdAndDelete(id)
    .then(() => {
      res.status(204).json();
    })
    .catch(next);
};
