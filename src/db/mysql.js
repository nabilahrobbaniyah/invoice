const mysql = require("mysql2/promise");
const env = require("../config/env");

const pool = mysql.createPool({
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME
});

module.exports = pool;