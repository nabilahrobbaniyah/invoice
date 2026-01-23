const pool = require("../../db/mysql");
const { v4: uuidv4 } = require("uuid");
const { success, error } = require("../utils/response");

/*
1. getAll - GET /clients
2. create - POST /clients
3. update - PUT /clients/:id
4. remove - DELETE /clients/:id
*/

async function getAll(req, res) {
  const [rows] = await pool.query(
    "SELECT id, name, email, phone, address FROM clients WHERE user_id = ? ORDER BY name",
    [req.session.userId]
  );

  return success(res, rows);
}

async function create(req, res) {
  const { name, email, phone, address } = req.body;

  if (!name || name.trim() === "") {
    return error(res, 400, "Nama wajib");
  }

  await pool.query(
    `INSERT INTO clients (id, user_id, name, email, phone, address)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [uuidv4(), req.session.userId, name.trim(), email || null, phone || null, address || null]
  );

  return success(res, null, "Client dibuat");
}

async function update(req, res) {
  const { id } = req.params;
  const { name, email, phone, address } = req.body;

  if (!name || name.trim() === "") {
    return error(res, 400, "Nama wajib");
  }

  const [rows] = await pool.query(
    "SELECT id FROM clients WHERE id = ? AND user_id = ?",
    [id, req.session.userId]
  );

  if (rows.length === 0) {
    return error(res, 404, "Client tidak ditemukan");
  }

  await pool.query(
    `UPDATE clients
     SET name = ?, email = ?, phone = ?, address = ?
     WHERE id = ?`,
    [name.trim(), email || null, phone || null, address || null, id]
  );

  return success(res, null, "Client diperbarui");
}

/*
CATATAN: hard delete hanya aman jika client belum dipakai invoice
*/
async function remove(req, res) {
  const { id } = req.params;

  const [rows] = await pool.query(
    "SELECT id FROM clients WHERE id = ? AND user_id = ?",
    [id, req.session.userId]
  );

  if (rows.length === 0) {
    return error(res, 404, "Client tidak ditemukan");
  }

  const [used] = await pool.query(
    "SELECT id FROM invoices WHERE client_id = ? LIMIT 1",
    [id]
  );

  if (used.length > 0) {
    return error(res, 400, "Client sudah digunakan di invoice");
  }

  await pool.query(
    "DELETE FROM clients WHERE id = ?",
    [id]
  );

  return success(res, null, "Client dihapus");
}

module.exports = {
  getAll,
  create,
  update,
  remove
};
