const pool = require("./db");

async function findByUsername(username) {
    const [rows] = await pool.query(
        "SELECT * FROM users WHERE username = ?",
        [username]
    );
    return rows[0];
}

module.exports = { findByUsername };
