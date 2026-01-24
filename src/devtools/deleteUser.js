const pool = require("../db/mysql");

async function run() {
  const email = "testuser@contoh.com";

  if (!email) {
    console.error("Email wajib");
    process.exit(1);
  }

  const [result] = await pool.query(
    "DELETE FROM users WHERE email = ?",
    [email]
  );

  if (result.affectedRows === 0) {
    console.log("User tidak ditemukan:", email);
  } else {
    console.log("User berhasil dihapus:", email);
  }

  process.exit();
}

run().catch(err => {
  console.error("Gagal menghapus user:", err.message);
  process.exit(1);
});
