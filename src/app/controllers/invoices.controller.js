const pool = require("../../db/mysql");
const { v4: uuidv4 } = require("uuid");
const { updateInvoiceStatus } = require("../services/invoiceStatus.service");
const { success, error } = require("../utils/response");
/*
1. createInvoice - POST /invoices
2. getInvoices - GET /invoices
3. getInvoiceById - GET /invoices/:id
4. updateStatus - PATCH /invoices/:id/status
5. listInvoices - GET /invoices?page=
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

async function getInvoiceById(req, res) {
  const { id } = req.params;

  const [invoices] = await pool.query(
    "SELECT * FROM invoices WHERE id = ? AND user_id = ?",
    [id, req.session.userId]
  );

  if (invoices.length === 0) {
    return error(res, 404, "Invoice tidak ditemukan");
  }

  const [items] = await pool.query(
    "SELECT * FROM invoice_items WHERE invoice_id = ?",
    [id]
  );

  return success(res, {
    ...invoices[0],
    items
  });
}

async function updateStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;

  if (!["draft", "sent", "paid"].includes(status)) {
    return error(res, 400, "Status tidak valid");
  }

  try {
    await updateInvoiceStatus(id, req.session.userId, status);
    return success(res, null, "Status diperbarui");
  } catch (err) {
    return error(res, err.status || 500, err.message || "Gagal update status");
  }
}

async function getInvoices(req, res) {
  console.log("Listing invoices with pagination", req.query);
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  const [rows] = await pool.query(
    "SELECT i.id, i.invoice_date, i.status, i.total_amount, c.name AS client_name FROM invoices i JOIN clients c ON c.id = i.client_id WHERE i.user_id = ? ORDER BY i.created_at DESC LIMIT ? OFFSET ?",
      [req.session.userId, limit, offset]
    );

    return success(res, rows);
}

module.exports = {
  createInvoice,
  getInvoiceById,
  updateStatus,
  getInvoices
};