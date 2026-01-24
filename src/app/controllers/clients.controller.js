const pool = require("../../db/mysql");
const { v4: uuidv4 } = require("uuid");
const { success, error } = require("../utils/response");

/*
1. getAll - GET /clients
2. detail - GET /clients/:id
3. create - POST /clients
4. update - PUT /clients/:id
5. remove - DELETE /clients/:id
*/

async function getAll(req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  const [rows] = await pool.query(
  "SELECT id, name, email, phone FROM clients WHERE user_id = ? ORDER BY name ASC LIMIT ? OFFSET ?",
  [req.session.userId, limit, offset]
  );

  return success(res, rows);
  }

async function detail(req, res) {
  const { id } = req.params;

  const [rows] = await pool.query(
  "SELECT * FROM clients WHERE id = ? AND user_id = ?",
  [id, req.session.userId]
  );

  if (rows.length === 0) {
  return error(res, 404, "Client tidak ditemukan");
  }

  return success(res, rows[0]);
}

async function create(req, res) {
  const { name, email, phone, address } = req.body;

  await pool.query(
    `INSERT INTO clients (id, user_id, name, email, phone, address)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [uuidv4(), req.session.userId, name, email, phone, address]
  );

  return success(res, null, "Client dibuat");
}

async function update(req, res) {
  const { id } = req.params;
  const { name, email, phone, address } = req.body;

  await pool.query(
    `UPDATE clients
     SET name = ?, email = ?, phone = ?, address = ?
     WHERE id = ? AND user_id = ?`,
    [name, email, phone, address, id, req.session.userId]
  );

  return success(res, null, "Client diperbarui");
}

/*
CATATAN: hard delete hanya aman jika client belum dipakai invoice
*/
async function remove(req, res) {
  const { id } = req.params;

  const [rows] = await pool.query(
    "SELECT id FROM invoices WHERE client_id = ? LIMIT 1",
    [id]
  );

  if (rows.length > 0) {
    return error(res, 404, "Client memiliki invoice, tidak dapat dihapus");
  }

  await pool.query(
    "DELETE FROM clients WHERE id = ? AND user_id = ?",
    [id, req.session.userId]
  );

  return success(res, null, "Client dihapus");
}

module.exports = {
  getAll,
  detail,
  create,
  update,
  remove
};
