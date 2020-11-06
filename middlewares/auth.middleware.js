const createError = require("http-errors");

module.exports.isAuthenticated = (req, _, next) => {
  if (req.session.user) {
    next();
  } else {
    next(createError(401));
  }
};

module.exports.isAuthtorized = (req, _, next) => {
  if (
    req.session.user &&
    (req.session.user.role === "admin" || req.session.user.role === "monitor")
  ) {
    next();
  } else {
    next(createError(403));
  }
};

module.exports.isAdmin = (req, _, next) => {
  if (req.session.user && req.session.user.role === "admin") {
    next();
  } else {
    next(createError(403));
  }
};

module.exports.isNotAuthenticated = (req, _, next) => {
  if (req.session.user) {
    next(createError(403));
  } else {
    next();
  }
};
