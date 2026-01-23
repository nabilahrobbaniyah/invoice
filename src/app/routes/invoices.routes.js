const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");

const controller = require("../controllers/invoices.controller");
const itemController = require("../controllers/invoiceItems.controller");

router.use(auth);

console.log(controller);

router.post("/", controller.createInvoice);

router.post("/:id/items", itemController.addItem);

router.post("/:id/items", (req, res, next) => {
console.log("ADD ITEM HIT");
next();
}, itemController.addItem);

// router.put("/:id/items/:itemId", itemController.updateItem);

// router.delete("/:id/items/:itemId", itemController.deleteItem);

module.exports = router;