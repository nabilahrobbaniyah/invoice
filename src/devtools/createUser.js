const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const pool = require("../db/mysql");

async function run() {
  const email = "testuser@contoh.com";
  const password = "password123";

  if (!email || !password) {
    console.error("Email dan password wajib");
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, 10);

  await pool.query(
    "INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)",
    [uuidv4(), email, hash]
  );

  console.log("User berhasil dibuat:", email);
  process.exit();
}

run().catch(err => {
  console.error("Gagal membuat user:", err.message);
  process.exit(1);
});
