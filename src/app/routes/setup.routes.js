const express = require("express");
const router = express.Router();
const controller = require("../controllers/setup.controller");

router.post("/init-user", controller.createInitialUser);

module.exports = router;