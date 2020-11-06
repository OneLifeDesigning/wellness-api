const Lesson = require("../models/lesson.model");
const UserLesson = require("../models/user.lesson.model");

module.exports.all = (req, res, next) => {
  Lesson.find({})
    .populate("monitorId")
    .populate("attachments")
    .then((lesson) => res.status(200).json(lesson))
    .catch(next);
};

module.exports.new = (req, res, next) => {
  if (req.file) {
    req.body.image = req.file.url;
  }
  const lesson = new Lesson(req.body);
  lesson
    .save()
    .then((lesson) => res.status(201).json(lesson))
    .catch(next);
};

module.exports.show = (req, res, next) => {
  const { id } = req.params;
  Lesson.findById(id)
    .populate("courseId")
    .populate("monitorId")
    .populate("games")
    .then((lesson) => res.status(200).json(lesson))
    .catch(next);
};

module.exports.edit = (req, res, next) => {
  const { id } = req.params;
  if (req.file) {
    req.body.image = req.file.url;
  }
  Lesson.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
    .then((lesson) => res.status(200).json(lesson))
    .catch(next);
};

module.exports.isCompleted = (req, res, next) => {
  const lessonId = req.params.id;
  const userId = req.currentUser.id;
  UserLesson.findOne({ lessonId, userId })
    .then((lesson) => {
      res.status(201).json(lesson);
    })
    .catch(next);
};
module.exports.getCompletedLessons = (req, res, next) => {
  const userId = req.currentUser.id;
  UserLesson.find({ userId })
    .then((lessons) => {
      res.status(201).json(lessons);
    })
    .catch(next);
};
module.exports.completed = (req, res, next) => {
  const lessonId = req.params.id;
  const userId = req.currentUser.id;
  const userLesson = new UserLesson({ lessonId, userId, isCompleted: true });
  userLesson
    .save()
    .then((lesson) => {
      res.status(201).json(lesson);
    })
    .catch(next);
};

module.exports.delete = (req, res, next) => {
  const { id } = req.params;
  Lesson.findByIdAndDelete(id)
    .then(() => {
      res.status(204).json();
    })
    .catch(next);
};
