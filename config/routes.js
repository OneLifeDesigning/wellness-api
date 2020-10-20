const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const usersController = require("../controllers/users.controller");
const homeController = require("../controllers/home.controller");

router.post(
  "/users/newTutor",
  authMiddleware.isNotAuthenticated,
  usersController.newTutor
);
router.post(
  "/users/newCamper",
  authMiddleware.isAuthenticated,
  usersController.newCamper
);
router.post(
  "/users/login",
  authMiddleware.isNotAuthenticated,
  usersController.login
);
router.post(
  "/users/logout",
  authMiddleware.isAuthenticated,
  usersController.logout
);

router.get("/home", authMiddleware.isAuthenticated, homeController.show);

module.exports = router;
