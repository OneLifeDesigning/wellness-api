const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const usersController = require("../controllers/users.controller");

router.get("/users", authMiddleware.isNotAuthenticated, usersController.all);

module.exports = router;
