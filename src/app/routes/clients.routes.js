const express = require("express");
const { auth } = require("../middlewares/auth.middleware");
const validateClientSort = require("../middlewares/validate.middleware");
const controller = require("../controllers/clients.controller");
const {
  validateCreateClient,
  validateUpdateClient
} = require("../middlewares/clients.validation");

const router = express.Router();

router.use(auth);

router.get("/", controller.getAll);
router.get("/:id", controller.detail);
router.post("/", validateCreateClient, controller.create);
router.put("/:id", validateUpdateClient, controller.update);
router.get("/", auth, validateClientSort, controller.getAll);
router.delete("/:id", controller.remove);

module.exports = router;
