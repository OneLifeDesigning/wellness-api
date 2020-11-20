require("dotenv").config();

const createError = require("http-errors");
const express = require("express");
const mongoose = require("mongoose");
require("../config/dbtest.config");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const router = require("../config/routes");

app.use("/", router);

app.listen(3001);

module.exports = app;
