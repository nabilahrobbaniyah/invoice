const pool = require("../../db/mysql");
const bcrypt = require("bcrypt");
const { success, error } = require("../utils/response");

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return error(res, 400, "Email dan password wajib");
  }

  const [rows] = await pool.query(
    "SELECT id, email, password_hash FROM users WHERE email = ?",
    [email]
  );

  if (rows.length === 0) {
    return error(res, 401, "Login gagal");
  }

  const user = rows[0];
  const valid = await bcrypt.compare(password, user.password_hash);

  if (!valid) {
    return error(res, 401, "Login gagal");
  }

  // INI KUNCI UTAMA
  req.session.userId = user.id;

  console.log("LOGIN SESSION:", req.session);

  return success(res, { id: user.id, email: user.email }, "Login sukses");
}

async function logout(req, res) {
  req.session.destroy(() => {
    res.clearCookie("sid");
    return success(res, null, "Logout sukses");
  });
}

async function me(req, res) {
  return success(res, { userId: req.session.userId });
}

module.exports = { login, logout, me };
