const Course = require("../models/course.model");
const User = require("../models/user.model");
const UserCourse = require("../models/user.course.model");

module.exports.all = (req, res, next) => {
  Course.find({})
    .populate("lessons")
    .populate("monitorId")
    .populate("campId")
    .populate({
      path: "attachments",
      model: "Attachment",
    })
    .populate({
      path: "campers",
      model: "UserCourse",
    })
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
    .populate("lessons")
    .populate("monitorId")
    .populate("campId")
    .populate({
      path: "attachments",
      model: "Attachment",
    })
    .populate({
      path: "campers",
      model: "UserCourse",
    })
    .then((course) => {
      console.log(course);
      res.status(200).json(course);
    })
    .catch(next);
};
module.exports.edit = (req, res, next) => {
  const { id } = req.params;
  if (req.file) {
    req.body.image = req.file.url;
  }
  Course.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
    .then((course) => res.status(200).json(course))
    .catch(next);
};
module.exports.enroll = (req, res, next) => {
  const courseId = req.params.id;
  const userId = req.params.user;

  User.find({ tutorId: req.currentUser.id })
    .then((campers) => {
      campers.some((camper) => camper.id === userId)
        ? UserCourse.findOne({ courseId, userId })
            .then((isEnrolled) => {
              if (isEnrolled) {
                res.status(204).json();
              } else {
                const userCourse = new UserCourse({ courseId, userId });
                userCourse
                  .save()
                  .then((userCourseEnrolled) => {
                    User.findById(userCourseEnrolled.userId)
                      .populate({
                        path: "camps",
                        model: "UserCamp",
                        populate: {
                          path: "camp",
                          model: "Camp",
                        },
                      })
                      .populate({
                        path: "courses",
                        model: "UserCourse",
                        populate: {
                          path: "course",
                          model: "Course",
                        },
                      })
                      .then((camper) => {
                        res.status(201).json(camper);
                      })
                      .catch(next);
                  })
                  .catch(next);
              }
            })
            .catch(next)
        : next();
    })
    .catch(next);
};

module.exports.disenroll = (req, res, next) => {
  const courseId = req.params.id;
  const userId = req.params.user;
  UserCourse.findOneAndDelete({ courseId, userId })
    .then(() => res.status(204).json())
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
