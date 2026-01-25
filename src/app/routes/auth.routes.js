const express = require("express");
const rateLimit = require("express-rate-limit");
const controller = require("../controllers/auth.controller");
const auth = require("../middlewares/auth.middleware");

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Terlalu banyak percobaan login"
  }
});

router.post("/login", loginLimiter, controller.login);
router.post("/logout", auth, controller.logout);
router.get("/me", auth, controller.me);

module.exports = router;
