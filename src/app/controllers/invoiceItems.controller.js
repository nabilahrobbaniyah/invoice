const pool = require("../../db/mysql");
const { v4: uuidv4 } = require("uuid");
const { success, error } = require("../utils/response");
const { recalculateInvoiceTotal } = require("../services/invoice.service");

async function addItem(req, res) {
const { id } = req.params;
const { description, quantity, unit_price } = req.body;

if (!description || quantity <= 0 || unit_price <= 0) {
return error(res, 400, "Item tidak valid");
}

const [invoices] = await pool.query(
"SELECT status, user_id FROM invoices WHERE id = ?",
[id]
);

if (invoices.length === 0) {
return error(res, 404, "Invoice tidak ditemukan");
}

const invoice = invoices[0];

if (invoice.user_id !== req.session.userId) {
return error(res, 403, "Bukan invoice milik user");
}

if (invoice.status !== "draft") {
return error(res, 400, "Invoice bukan draft");
}

const subtotal = quantity * unit_price;

await pool.query(
"INSERT INTO invoice_items (id, invoice_id, description, quantity, unit_price, subtotal) VALUES (?, ?, ?, ?, ?, ?)",
[uuidv4(), id, description, quantity, unit_price, subtotal]
);

const total = await recalculateInvoiceTotal(id);

return success(res, { total }, "Item ditambahkan");
}

module.exports = { addItem };

//router.post("/:id/items", itemController.addItem);