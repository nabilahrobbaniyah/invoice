const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const pool = require("../db/mysql");

async function run() {
const password = "admin123";
const hash = await bcrypt.hash(password, 10);

await pool.query(
    "INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)",
    [uuidv4(), "admin@test.com", hash]
);

console.log("User dibuat");
process.exit();
}

run();