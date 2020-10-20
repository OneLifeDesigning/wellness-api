require("dotenv").config();

const express = require("express");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

require("../config/dbtest.config");
const session = require("../config/session.config");

/**
 * Configure express
 */
const app = express();
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session);

app.use((req, _, next) => {
  req.currentUser = req.session.user;
  next();
});

/**
 * Configure routes
 */
const router = require("../config/routes");
app.use("/api", router);

/**
 * Listen on provided port
 */
app.listen(3001);

module.exports = app;
