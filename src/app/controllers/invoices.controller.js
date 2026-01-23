const pool = require("../../db/mysql");
const { v4: uuidv4 } = require("uuid");
const { success, error } = require("../utils/response");

async function createInvoice(req, res) {
const { client_id, invoice_date } = req.body;

if (!client_id || !invoice_date) {
return error(res, 400, "client_id dan invoice_date wajib");
}

const [clients] = await pool.query(
"SELECT id FROM clients WHERE id = ? AND user_id = ?",
[client_id, req.session.userId]
);

if (clients.length === 0) {
return error(res, 403, "Client tidak valid");
}

const invoiceId = uuidv4();

// untuk membuat draft invoice
await pool.query(
"INSERT INTO invoices (id, user_id, client_id, invoice_date, status, total_amount) VALUES (?, ?, ?, ?, 'draft', 0)",
[invoiceId, req.session.userId, client_id, invoice_date]
);

return success(res, { id: invoiceId }, "Invoice draft dibuat");
}

module.exports = { createInvoice };

