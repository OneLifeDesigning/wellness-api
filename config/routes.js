const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const usersController = require("../controllers/users.controller");
const campController = require("../controllers/camp.controller");
const homeController = require("../controllers/home.controller");
const upload = require("./cloudinary.config");

// Users
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

// Camps
router.get("/camps", campController.all);
router.get("/camps/:id/show", campController.show);
router.post(
  "/camps/new",
  authMiddleware.isAuthenticated,
  upload.single("image"),
  campController.new
);
router.patch(
  "/camps/:id/edit",
  authMiddleware.isAuthenticated,
  upload.single("image"),
  campController.edit
);
router.delete(
  "/camps/:id/delete",
  authMiddleware.isAuthenticated,
  campController.delete
);

router.get("/home", authMiddleware.isAuthenticated, homeController.show);

module.exports = router;
