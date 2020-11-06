const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const userController = require("../controllers/user.controller");
const campController = require("../controllers/camp.controller");
const courseController = require("../controllers/course.controller");
const lessonController = require("../controllers/lesson.controller");
const contentController = require("../controllers/content.controller");
const attachmentController = require("../controllers/attachment.controller");
const gameController = require("../controllers/game.controller");
const newsController = require("../controllers/news.controller");
const chatsController = require("../controllers/chat.controller");
const homeController = require("../controllers/home.controller");
const upload = require("./cloudinary.config");

router.get("/home", authMiddleware.isAuthenticated, homeController.show);

// Users
router.get(
  "/users",
  authMiddleware.isAuthenticated,
  authMiddleware.isAdmin,
  userController.all
);

router.get(
  "/users/:id",
  authMiddleware.isAuthenticated,
  userController.profile
);
router.get(
  "/users/:id/campers",
  authMiddleware.isAuthenticated,
  userController.getCampers
);

router.get(
  "/users/:id/tutorize",
  authMiddleware.isAuthenticated,
  userController.tutorize
);

router.patch("/users/:id", authMiddleware.isAuthenticated, userController.edit);

router.post(
  "/users/newTutor",
  authMiddleware.isNotAuthenticated,
  userController.newTutor
);
router.post(
  "/users/newCamper",
  authMiddleware.isAuthenticated,
  userController.newCamper
);
router.post(
  "/users/newMonitor",
  authMiddleware.isAuthenticated,
  authMiddleware.isAdmin,
  upload.single("image"),
  userController.newMonitor
);
router.post(
  "/users/newAdmin",
  authMiddleware.isAuthenticated,
  authMiddleware.isAdmin,
  upload.single("image"),
  userController.newAdmin
);

router.post("/login", authMiddleware.isNotAuthenticated, userController.login);
router.post("/logout", authMiddleware.isAuthenticated, userController.logout);

// Camps
router.get("/camps", authMiddleware.isAuthenticated, campController.all);
router.get("/camps/:id", authMiddleware.isAuthenticated, campController.show);
router.post(
  "/camps/new",
  authMiddleware.isAuthenticated,
  authMiddleware.isAdmin,
  upload.single("image"),
  campController.new
);
router.patch(
  "/camps/:id",
  authMiddleware.isAuthenticated,
  authMiddleware.isAdmin,
  upload.single("image"),
  campController.edit
);
router.delete(
  "/camps/:id",
  authMiddleware.isAuthenticated,
  authMiddleware.isAdmin,
  campController.delete
);

router.get(
  "/camps/:id/courses",
  authMiddleware.isAuthenticated,
  campController.campCourses
);

router.post(
  "/camps/:id/enroll/:user",
  authMiddleware.isAuthenticated,
  campController.enroll
);
router.delete(
  "/camps/:id/disenroll/:user",
  authMiddleware.isAuthenticated,
  campController.disenroll
);

// Courses
router.get("/courses", courseController.all);
router.get("/courses/:id", courseController.show);
router.post(
  "/courses/new",
  authMiddleware.isAuthenticated,
  authMiddleware.isAdmin,
  upload.single("image"),
  courseController.new
);

router.patch(
  "/courses/:id",
  authMiddleware.isAuthenticated,
  authMiddleware.isAdmin,
  upload.single("image"),
  courseController.edit
);

router.delete(
  "/courses/:id",
  authMiddleware.isAuthenticated,
  courseController.delete
);

router.post(
  "/courses/:id/enroll/:user",
  authMiddleware.isAuthenticated,
  courseController.enroll
);

router.delete(
  "/courses/:id/disenroll/:user",
  authMiddleware.isAuthenticated,
  courseController.disenroll
);

// Lessons
router.get("/lessons", authMiddleware.isAuthenticated, lessonController.all);
router.get(
  "/lessons/:id",
  authMiddleware.isAuthenticated,
  lessonController.show
);

router.post(
  "/lessons/new",
  authMiddleware.isAuthenticated,
  authMiddleware.isAdmin,
  upload.single("image"),
  lessonController.new
);
router.patch(
  "/lessons/:id",
  authMiddleware.isAuthenticated,
  authMiddleware.isAdmin,
  upload.single("image"),
  lessonController.edit
);
router.get(
  "/lessons/:id/completed",
  authMiddleware.isAuthenticated,
  lessonController.isCompleted
);

router.patch(
  "/lessons/:id/completed",
  authMiddleware.isAuthenticated,
  lessonController.completed
);
router.delete(
  "/lessons/:id",
  authMiddleware.isAuthenticated,
  authMiddleware.isAdmin,
  lessonController.delete
);

// Contents
router.get("/contents", contentController.all);
router.get("/contents/:id", contentController.show);
router.post(
  "/contents/new",
  authMiddleware.isAuthenticated,
  authMiddleware.isAdmin,
  upload.single("image"),
  contentController.new
);
router.patch(
  "/contents/:id",
  authMiddleware.isAuthenticated,
  authMiddleware.isAdmin,
  upload.single("image"),
  contentController.edit
);

router.delete(
  "/contents/:id",
  authMiddleware.isAuthenticated,
  authMiddleware.isAdmin,
  contentController.delete
);

// Attachments
router.get(
  "/attachments",
  authMiddleware.isAuthenticated,
  authMiddleware.isAdmin,
  attachmentController.all
);
router.get(
  "/attachments/:id",
  authMiddleware.isAuthenticated,
  authMiddleware.isAdmin,
  attachmentController.show
);

router.post(
  "/attachments/new/:parentId",
  authMiddleware.isAuthenticated,
  authMiddleware.isAdmin,
  upload.single("file"),
  attachmentController.new
);

router.patch(
  "/attachments/:id",
  authMiddleware.isAuthenticated,
  authMiddleware.isAdmin,
  upload.single("image"),
  attachmentController.edit
);
router.delete(
  "/attachments/:id",
  authMiddleware.isAuthenticated,
  authMiddleware.isAdmin,
  attachmentController.delete
);

// Games
router.get("/games", gameController.all);
router.get("/games/:id", gameController.show);

router.post(
  "/games/new",
  authMiddleware.isAuthenticated,
  authMiddleware.isAdmin,
  upload.single("file"),
  gameController.new
);

router.patch(
  "/games/:id",
  authMiddleware.isAuthenticated,
  authMiddleware.isAdmin,
  upload.single("image"),
  gameController.edit
);

router.delete(
  "/games/:id",
  authMiddleware.isAuthenticated,
  authMiddleware.isAdmin,
  gameController.delete
);

router.get(
  "/games/:id/started",
  authMiddleware.isAuthenticated,
  gameController.isStarted
);
router.post(
  "/games/:id/start",
  authMiddleware.isAuthenticated,
  gameController.start
);

router.get(
  "/games/find/:token",
  authMiddleware.isAuthenticated,
  gameController.findGame
);

router.post(
  "/games/completed",
  authMiddleware.isAuthenticated,
  gameController.complete
);
router.post(
  "/games/:id/completed",
  authMiddleware.isAuthenticated,
  gameController.complete
);

// News
router.get("/news", newsController.all);
router.get("/news/:id", newsController.show);

router.post(
  "/news/new",
  authMiddleware.isAuthenticated,
  authMiddleware.isAdmin,
  upload.single("file"),
  newsController.new
);

router.patch(
  "/news/:id",
  authMiddleware.isAuthenticated,
  authMiddleware.isAdmin,
  upload.single("image"),
  newsController.edit
);

router.delete(
  "/news/:id",
  authMiddleware.isAuthenticated,
  authMiddleware.isAdmin,
  newsController.delete
);

// Chats
router.get("/chats", authMiddleware.isAuthenticated, chatsController.all);
router.get("/chats/:id", authMiddleware.isAuthenticated, chatsController.show);

router.patch(
  "/chats/:id/participants",
  authMiddleware.isAuthenticated,
  chatsController.addParticipants
);

router.delete(
  "/chats/:id/participants",
  authMiddleware.isAuthenticated,
  chatsController.deleteParticipants
);

router.post("/chats/new", authMiddleware.isAuthenticated, chatsController.new);

router.post(
  "/chats/:id/message",
  authMiddleware.isAuthenticated,
  chatsController.newMessage
);

router.get(
  "/notifications",
  authMiddleware.isAuthenticated,
  chatsController.getNotifications
);

router.patch(
  "/notifications/:id",
  authMiddleware.isAuthenticated,
  chatsController.patchNotification
);
router.delete(
  "/notifications/:id",
  authMiddleware.isAuthenticated,
  chatsController.deleteNotification
);

module.exports = router;
