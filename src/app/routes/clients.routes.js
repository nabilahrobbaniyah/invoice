const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const controller = require("../controllers/clients.controller");

router.use(auth);

router.get("/", controller.getAll);
router.post("/", controller.create);

module.exports = router;