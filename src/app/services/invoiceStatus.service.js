const pool = require("../../db/mysql");

function isTransitionAllowed(from, to) {
const rules = {
draft: ["sent"],
sent: ["paid"],
paid: []
};
return rules[from]?.includes(to);
}

async function getItemCount(invoiceId) {
const [rows] = await pool.query(
"SELECT COUNT(*) AS count FROM invoice_items WHERE invoice_id = ?",
[invoiceId]
);
return rows[0].count;
}

async function updateInvoiceStatus(invoiceId, userId, newStatus) {
const [rows] = await pool.query(
"SELECT status FROM invoices WHERE id = ? AND user_id = ?",
[invoiceId, userId]
);

if (rows.length === 0) {
throw { status: 404, message: "Invoice tidak ditemukan" };
}

const currentStatus = rows[0].status;

if (!isTransitionAllowed(currentStatus, newStatus)) {
throw { status: 400, message: "Transisi status ilegal" };
}

if (newStatus === "sent") {
const count = await getItemCount(invoiceId);
if (count === 0) {
throw { status: 400, message: "Invoice sent wajib punya item" };
}
}

await pool.query(
"UPDATE invoices SET status = ? WHERE id = ?",
[newStatus, invoiceId]
);
}

module.exports = { updateInvoiceStatus };