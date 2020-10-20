const User = require("../models/user.model");
const createError = require("http-errors");

module.exports.newTutor = (req, res, next) => {
  const {
    username,
    name,
    lastname,
    email,
    password,
    birthday,
    terms,
  } = req.body;
  const user = new User({
    username: username,
    name: name,
    lastname: lastname,
    email: email,
    password: password,
    birthday: birthday,
    terms: terms,
    role: "tutor",
  });

  user
    .save()
    .then((user) => res.status(201).json(user))
    .catch(next);
};

module.exports.newCamper = (req, res, next) => {
  const user = new User(req.body);

  user
    .save()
    .then((user) => res.status(201).json(user))
    .catch(next);
};

module.exports.newMonitor = (req, res, next) => {
  const {
    name,
    lastname,
    password,
    birthday,
    email,
    phone,
    address,
    terms,
  } = req.body;
  const user = new User({
    username: username,
    password: password,
    name: name,
    lastname: lastname,
    email: email,
    address: address,
    phone: phone,
    birthday: birthday,
    avatar: req.file ? req.file.url : undefined,
    terms: terms,
    role: "monitor",
  });

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

module.exports.logout = (req, res) => {
  req.session.destroy();
  res.status(204).json();
};
