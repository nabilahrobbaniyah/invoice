const pool = require("../../db/mysql");
const { v4: uuidv4 } = require("uuid");
const { success, error } = require("../utils/response");
const { recalculateInvoiceTotal } = require("../services/invoice.service");

/*
1. addItem - POST /invoices/:id/items
2. updateItem - PUT /invoices/:id/items/:itemId
3. deleteItem - DELETE /invoices/:id/items/:itemId 
*/

async function addItem(req, res) {
  const { id: invoiceId } = req.params;
  const { description, quantity, unit_price } = req.body;

  if (!description || typeof quantity !== "number" || typeof unit_price !== "number") {
    return error(res, 400, "Data item tidak valid");
  }

  if (quantity <= 0 || unit_price <= 0) {
    return error(res, 400, "Quantity dan unit_price harus > 0");
  }

  const [invoices] = await pool.query(
    "SELECT user_id, status FROM invoices WHERE id = ?",
    [invoiceId]
  );

  if (invoices.length === 0) {
    return error(res, 404, "Invoice tidak ditemukan");
  }

  const invoice = invoices[0];

  if (invoice.user_id !== req.session.userId) {
    return error(res, 403, "Akses ditolak");
  }

  if (invoice.status !== "draft") {
    return error(res, 400, "Invoice bukan draft");
  }

  const subtotal = quantity * unit_price;

  await pool.query(
    `INSERT INTO invoice_items
     (id, invoice_id, description, quantity, unit_price, subtotal)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [uuidv4(), invoiceId, description, quantity, unit_price, subtotal]
  );

  const total = await recalculateInvoiceTotal(invoiceId);

  return success(res, { total }, "Item ditambahkan");
}

async function updateItem(req, res) {
  const { id: invoiceId, itemId } = req.params;
  const { quantity, unit_price } = req.body;

  if (typeof quantity !== "number" || typeof unit_price !== "number") {
    return error(res, 400, "Data tidak valid");
  }

  if (quantity <= 0 || unit_price <= 0) {
    return error(res, 400, "Quantity dan unit_price harus > 0");
  }

  const [invoices] = await pool.query(
    "SELECT user_id, status FROM invoices WHERE id = ?",
    [invoiceId]
  );

  if (invoices.length === 0) {
    return error(res, 404, "Invoice tidak ditemukan");
  }

  const invoice = invoices[0];

  if (invoice.user_id !== req.session.userId) {
    return error(res, 403, "Akses ditolak");
  }

  if (invoice.status !== "draft") {
    return error(res, 400, "Invoice bukan draft");
  }

  const [items] = await pool.query(
    "SELECT id FROM invoice_items WHERE id = ? AND invoice_id = ?",
    [itemId, invoiceId]
  );

  if (items.length === 0) {
    return error(res, 404, "Item tidak ditemukan");
  }

  const subtotal = quantity * unit_price;

  await pool.query(
    `UPDATE invoice_items
     SET quantity = ?, unit_price = ?, subtotal = ?
     WHERE id = ?`,
    [quantity, unit_price, subtotal, itemId]
  );

  const total = await recalculateInvoiceTotal(invoiceId);

  return success(res, { total }, "Item diperbarui");
}

async function deleteItem(req, res) {
  const { id: invoiceId, itemId } = req.params;

  const [invoices] = await pool.query(
    "SELECT user_id, status FROM invoices WHERE id = ?",
    [invoiceId]
  );

  if (invoices.length === 0) {
    return error(res, 404, "Invoice tidak ditemukan");
  }

  const invoice = invoices[0];

  if (invoice.user_id !== req.session.userId) {
    return error(res, 403, "Akses ditolak");
  }

  if (invoice.status !== "draft") {
    return error(res, 400, "Invoice bukan draft");
  }

  const [items] = await pool.query(
    "SELECT id FROM invoice_items WHERE id = ? AND invoice_id = ?",
    [itemId, invoiceId]
  );

  if (items.length === 0) {
    return error(res, 404, "Item tidak ditemukan");
  }

  await pool.query(
    "DELETE FROM invoice_items WHERE id = ?",
    [itemId]
  );

  const total = await recalculateInvoiceTotal(invoiceId);

  return success(res, { total }, "Item dihapus");
}

module.exports = {
  addItem,
  updateItem,
  deleteItem
};