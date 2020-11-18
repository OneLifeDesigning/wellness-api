const express = require("express");
const router = express.Router();
const dataController = require("../controllers/data.controller");

// CRUD
router.post("/data", dataController.create);

router.get("/data", dataController.read);

router.patch("/data", dataController.update);

router.delete("/data", dataController.delete);

module.exports = router;
