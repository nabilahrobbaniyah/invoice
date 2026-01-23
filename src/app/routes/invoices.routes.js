const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");

const invoiceController = require("../controllers/invoices.controller");
const itemController = require("../controllers/invoiceItems.controller");

router.use(auth);

// invoices
router.post("/", invoiceController.createInvoice);
router.get("/", invoiceController.getInvoices);
router.get("/:id", invoiceController.getInvoiceById);

// items
router.post("/:id/items", itemController.addItem);
router.put("/:id/items/:itemId", itemController.updateItem);
router.delete("/:id/items/:itemId", itemController.deleteItem);

module.exports = router;
