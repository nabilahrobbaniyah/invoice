const pool = require("../../db/mysql");
const { v4: uuidv4 } = require("uuid");
const { success, error } = require("../utils/response");

async function getAll(req, res) {
    const [rows] = await pool.query(
        "SELECT * FROM clients WHERE user_id = ?",
        [req.session.userId]
    );
    return success(res, rows);
}

async function create(req, res) {
    const { name, email, phone, address } = req.body;
    if (!name) {
        return error(res, 400, "Nama wajib");
    }

    await pool.query(
        "INSERT INTO clients (id, user_id, name, email, phone, address) VALUES (?, ?, ?, ?, ?, ?)",
        [uuidv4(), req.session.userId, name, email, phone, address]
    );

    return success(res, null, "Client dibuat");
}

module.exports = { getAll, create };