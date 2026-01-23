const pool = require("../../db/mysql");

async function recalculateInvoiceTotal(invoiceId) {
  const [rows] = await pool.query(
    "SELECT COALESCE(SUM(subtotal), 0) AS total FROM invoice_items WHERE invoice_id = ?",
    [invoiceId]
  );

  const total = rows[0].total;

  await pool.query(
    "UPDATE invoices SET total_amount = ? WHERE id = ?",
    [total, invoiceId]
  );

  return total;
}

module.exports = {
  recalculateInvoiceTotal
};