const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const pool = require("../../db/mysql");
const { success, error } = require("../utils/response");

async function createInitialUser(req, res) {
const { email, password } = req.body;

if (!email || !password) {
return error(res, 400, "Email dan password wajib");
}

const [exist] = await pool.query(
"SELECT id FROM users WHERE email = ?",
[email]
);

if (exist.length > 0) {
return error(res, 400, "User sudah ada");
}

const hash = await bcrypt.hash(password, 10);

await pool.query(
"INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)",
[uuidv4(), email, hash]
);

return success(res, null, "User awal dibuat");
}

module.exports = { createInitialUser };