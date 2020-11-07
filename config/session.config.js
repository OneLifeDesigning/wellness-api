const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");
const SESSION_MAX_AGE_SECONDS =
  Number(process.env.SESSION_MAX_AGE_SECONDS) || 60 * 60 * 24 * 7;
if (process.env.DEV === "dev") {
  module.exports = session({
    secret: process.env.SESSION_SECRET || "I broke the production chain",
    resave: true,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: SESSION_MAX_AGE_SECONDS * 1000,
    },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: SESSION_MAX_AGE_SECONDS,
    }),
  });
} else {
  module.exports = session({
    secret: process.env.SESSION_SECRET || "I broke the production chain",
    resave: true,
    saveUninitialized: false,
    cookie: {
      secure: true,
      httpOnly: true,
      maxAge: SESSION_MAX_AGE_SECONDS * 1000,
      sameSite: "none",
    },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: SESSION_MAX_AGE_SECONDS,
    }),
  });
}
