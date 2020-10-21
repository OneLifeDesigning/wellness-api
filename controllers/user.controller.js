const createError = require("http-errors");
const User = require("../models/user.model");

module.exports.all = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).json(users))
    .catch(next);
};

module.exports.newTutor = (req, res, next) => {
  if (!req.body.email) {
    throw createError(400, "Email is required");
  }
  const user = new User(req.body);
  user.role = "tutor";

  user
    .save()
    .then((user) => res.status(201).json(user))
    .catch(next);
};

module.exports.newCamper = (req, res, next) => {
  const user = new User(req.body);
  user.role = "camper";

  user
    .save()
    .then((user) => res.status(201).json(user))
    .catch(next);
};

module.exports.newMonitor = (req, res, next) => {
  if (!req.body.email) {
    throw createError(400, "Email is required");
  }
  if (req.file) {
    req.body.image = req.file.url;
  }
  const user = new User(req.body);
  user.role = "monitor";

  user
    .save()
    .then((user) => res.status(201).json(user))
    .catch(next);
};

module.exports.newAdmin = (req, res, next) => {
  if (!req.body.email) {
    throw createError(400, "Email is required");
  }
  if (req.file) {
    req.body.image = req.file.url;
  }
  const user = new User(req.body);
  user.role = "admin";

  user
    .save()
    .then((user) => res.status(201).json(user))
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { username, password } = req.body;
  if (!username && !password) {
    throw createError(400, "Missing credentials");
  }
  User.findOne({ username: username })
    .then((user) => {
      if (!user) {
        throw createError(404, "Missing credentials");
      } else {
        return user.checkPassword(password).then((match) => {
          if (!match) {
            throw createError(400, "Missing credentials");
          } else {
            req.session.user = user;
            res.status(200).json(user);
          }
        });
      }
    })
    .catch(next);
};

module.exports.profile = (req, res, next) => {
  if (
    req.currentUser.role !== "admin" &&
    req.params.id !== req.currentUser.id
  ) {
    throw createError(403, "Only view your profile");
  }
  User.findById(req.params.id)
    .populate({
      path: "campers",
      model: "User",
    })
    .populate({
      path: "camps",
      model: "UserCamp",
      populate: {
        path: "camps",
        model: "Camp",
      },
    })
    .populate({
      path: "courses",
      model: "UserCourse",
      populate: {
        path: "courses",
        model: "Course",
      },
    })
    .populate({
      path: "lessons",
      model: "UserLesson",
      populate: {
        path: "lessons",
        model: "Lesson",
      },
    })
    .then((user) => res.status(200).json(user))
    .catch(next);
};
module.exports.tutorize = (req, res, next) => {
  User.find({
    $and: [{ tutorId: req.currentUser.id }, { _id: req.params.id }],
  })
    .populate({
      path: "camps",
      model: "UserCamp",
      populate: {
        path: "camps",
        model: "Camp",
      },
    })
    .populate({
      path: "courses",
      model: "UserCourse",
      populate: {
        path: "courses",
        model: "Course",
      },
    })
    .populate({
      path: "lessons",
      model: "UserLesson",
      populate: {
        path: "lessons",
        model: "Lesson",
      },
    })
    .then((camper) => {
      res.status(200).json(camper);
    })
    .catch(next);
};

module.exports.edit = (req, res, next) => {
  const id =
    req.currentUser.role === "admin" ? req.params.id : req.currentUser.id;

  if (req.file) {
    req.body.image = req.file.url;
  }
  User.findByIdAndUpdate(id, req.body)
    .then((user) => res.status(200).json(user))
    .catch(next);
};

module.exports.logout = (req, res) => {
  req.session.destroy();
  res.status(204).json();
};
