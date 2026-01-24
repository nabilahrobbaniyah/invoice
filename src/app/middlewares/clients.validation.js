const pool = require("../../db/mysql");

function isValidEmail(email) {
return /^[^\s@]+@[^\s@]+.[^\s@]+$/.test(email);
}

async function validateCreateClient(req, res, next) {
    const { name, email } = req.body;

    if (!name || name.trim() === "") {
    return res.status(400).json({
    success: false,
    message: "Nama wajib diisi"
    });
    }

    if (email && !isValidEmail(email)) {
    return res.status(400).json({
    success: false,
    message: "Format email tidak valid"
    });
    }

    if (email) {
    const [rows] = await pool.query(
    "SELECT id FROM clients WHERE user_id = ? AND email = ?",
    [req.session.userId, email]
    );

    if (rows.length > 0) {
    return res.status(409).json({
        success: false,
        message: "Email client sudah digunakan"
    });
    }
    }
        
    next();
}

async function validateUpdateClient(req, res, next) {
    const { id } = req.params;
    const { name, email } = req.body;

    const [clients] = await pool.query(
    "SELECT id FROM clients WHERE id = ? AND user_id = ?",
    [id, req.session.userId]
);

if (clients.length === 0) {
return res.status(404).json({
success: false,
message: "Client tidak ditemukan"
});
}

if (email && !isValidEmail(email)) {
return res.status(400).json({
success: false,
message: "Format email tidak valid"
});
}

if (email) {
const [rows] = await pool.query(
"SELECT id FROM clients WHERE user_id = ? AND email = ? AND id != ?",
[req.session.userId, email, id]
);

if (rows.length > 0) {
  return res.status(409).json({
    success: false,
    message: "Email client sudah digunakan"
  });
}
}
next();
  }

module.exports = {
validateCreateClient,
validateUpdateClient
};