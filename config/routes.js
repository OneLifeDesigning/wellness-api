const express = require("express");
const router = express.Router();
const dataController = require("../controllers/data.controller");

// CRUD
router.get("/data", dataController.readAll);

router.post("/data", dataController.create);

router.get("/data/:id", dataController.read);

router.patch("/data/:id", dataController.update);

router.delete("/data/:id", dataController.delete);

module.exports = router;
