const bcrypt = require("bcrypt");
const pool = require("../../db/mysql");
const { success, error } = require("../utils/response");

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return error(res, 400, "Email dan password wajib");
  }

  const [rows] = await pool.query(
    "SELECT id, password_hash FROM users WHERE email = ?",
    [email]
  );

  if (rows.length === 0) {
    return error(res, 401, "Email atau password salah");
  }

  const user = rows[0];
  const match = await bcrypt.compare(password, user.password_hash);

  if (!match) {
    return error(res, 401, "Email atau password salah");
  }

  req.session.regenerate(err => {
    if (err) {
      return error(res, 500, "Gagal membuat session");
    }

    req.session.userId = user.id;
    return success(res, null, "Login berhasil");
  });
}

function logout(req, res) {
  req.session.destroy(err => {
    if (err) {
      return error(res, 500, "Gagal logout");
    }
    res.clearCookie("invoice.sid");
    return success(res, null, "Logout berhasil");
  });
}

function me(req, res) {
  if (!req.session.userId) {
    return error(res, 401, "Unauthorized");
  }
  return success(res, { userId: req.session.userId });
}

module.exports = { login, logout, me };
