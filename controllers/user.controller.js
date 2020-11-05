const createError = require("http-errors");
const User = require("../models/user.model");

module.exports.all = (req, res, next) => {
  User.find({})
    .populate("tutorId")
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
    .then((user) => {
      req.session.user = user;
      res.status(201).json(user);
    })
    .catch(next);
};

module.exports.newCamper = (req, res, next) => {
  const user = new User(req.body);
  user.role = "camper";
  user.tutorId = req.currentUser.id;

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
  User.findOne({ username })
    .populate("tutorId")
    .populate({
      path: "camps",
      model: "UserCamp",
      populate: {
        path: "campId",
        model: "Camp",
      },
    })
    .populate({
      path: "courses",
      model: "UserCourse",
      populate: {
        path: "course",
        model: "Course",
        populate: {
          path: "monitor",
          model: "User",
        },
        populate: {
          path: "lessons",
          model: "Lesson",
          populate: {
            path: "monitorId",
            model: "User",
          },
          populate: {
            path: "games",
            model: "Game",
            populate: {
              path: "monitorId",
              model: "User",
            },
          },
        },
      },
    })
    .populate("campers")
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
    .populate("tutorId")
    .populate({
      path: "camps",
      model: "UserCamp",
      populate: {
        path: "campId",
        model: "Camp",
      },
    })
    .populate({
      path: "courses",
      model: "UserCourse",
      populate: {
        path: "course",
        model: "Course",
        populate: {
          path: "monitor",
          model: "User",
        },
        populate: {
          path: "lessons",
          model: "Lesson",
          populate: {
            path: "monitorId",
            model: "User",
          },
          populate: {
            path: "games",
            model: "Game",
            populate: {
              path: "monitorId",
              model: "User",
            },
          },
        },
      },
    })
    .populate("campers")
    .then((user) => {
      res.status(200).json(user);
    })
    .catch(next);
};

module.exports.getCampers = (req, res, next) => {
  if (
    req.currentUser.role !== "admin" &&
    req.params.id !== req.currentUser.id
  ) {
    throw createError(403, "Only view your profile");
  }

  User.find({ tutorId: req.currentUser.id })
    .populate("tutorId")
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
        populate: {
          path: "monitor",
          model: "User",
        },
      },
    })
    .populate({
      path: "lessons",
      model: "UserLesson",
    })
    .populate({
      path: "games",
      model: "UserGame",
      populate: {
        path: "game",
        model: "Game",
      },
    })
    .populate("campers")
    .then((user) => {
      res.status(200).json(user);
    })
    .catch(next);
};

module.exports.tutorize = (req, res, next) => {
  User.find({
    $and: [{ tutorId: req.currentUser.id }, { _id: req.params.id }],
  })
    .populate("tutorId")
    .populate({
      path: "camps",
      model: "UserCamp",
      populate: {
        path: "campId",
        model: "Camp",
      },
    })
    .populate({
      path: "courses",
      model: "UserCourse",
      populate: {
        path: "course",
        model: "Course",
        populate: {
          path: "monitor",
          model: "User",
        },
        populate: {
          path: "lessons",
          model: "Lesson",
          populate: {
            path: "monitorId",
            model: "User",
          },
          populate: {
            path: "games",
            model: "Game",
            populate: {
              path: "monitorId",
              model: "User",
            },
          },
        },
      },
    })
    .then((camper) => {
      console.log(camper);
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

  User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
    .populate("tutorId")
    .populate({
      path: "camps",
      model: "UserCamp",
      populate: {
        path: "campId",
        model: "Camp",
      },
    })
    .populate({
      path: "courses",
      model: "UserCourse",
      populate: {
        path: "course",
        model: "Course",
        populate: {
          path: "monitor",
          model: "User",
        },
        populate: {
          path: "lessons",
          model: "Lesson",
          populate: {
            path: "monitorId",
            model: "User",
          },
          populate: {
            path: "games",
            model: "Game",
            populate: {
              path: "monitorId",
              model: "User",
            },
          },
        },
      },
    })
    .then((user) => res.status(200).json(user))
    .catch(next);
};

module.exports.logout = (req, res) => {
  req.session.destroy();
  res.status(204).json();
};
