const pool = require("../../db/mysql");
const { v4: uuidv4 } = require("uuid");
const { success, error } = require("../utils/response");

/*
1. createInvoice - POST /invoices
2. getInvoices - GET /invoices
3. getInvoiceById - GET /invoices/:id
*/

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

  const id = uuidv4();

  await pool.query(
    `INSERT INTO invoices
     (id, user_id, client_id, invoice_date, status, total_amount)
     VALUES (?, ?, ?, ?, 'draft', 0)`,
    [id, req.session.userId, client_id, invoice_date]
  );

  return success(res, { id }, "Invoice draft dibuat");
}

async function getInvoices(req, res) {
  const [rows] = await pool.query(
    `SELECT i.id, i.invoice_date, i.status, i.total_amount,
            c.name AS client_name
     FROM invoices i
     JOIN clients c ON c.id = i.client_id
     WHERE i.user_id = ?
     ORDER BY i.invoice_date DESC`,
    [req.session.userId]
  );

  return success(res, rows);
}

async function getInvoiceById(req, res) {
  const { id } = req.params;

  const [rows] = await pool.query(
    `SELECT id, client_id, invoice_date, status, total_amount
     FROM invoices
     WHERE id = ? AND user_id = ?`,
    [id, req.session.userId]
  );

  if (rows.length === 0) {
    return error(res, 404, "Invoice tidak ditemukan");
  }

  return success(res, rows[0]);
}

module.exports = {
  createInvoice,
  getInvoices,
  getInvoiceById
};