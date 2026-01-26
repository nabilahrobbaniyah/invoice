const pool = require("../../db/mysql");
const bcrypt = require("bcrypt");

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const [rows] = await pool.query(
      "SELECT id, password_hash FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Email atau password salah"
      });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Email atau password salah"
      });
    }

    req.session.userId = user.id;

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

function logout(req, res) {
  req.session.destroy(() => {
    res.json({ success: true });
  });
}

function me(req, res) {
  res.json({
    success: true,
    user: {
      id: req.user.id
    }
  });
}

module.exports = {
  login,
  logout,
  me
};
