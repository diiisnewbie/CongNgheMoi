const pool = require("./db");

const Product = {
    findAll: async () => {
        const [rows] = await pool.query("SELECT * FROM products");
        return rows;
    },

    findById: async (id) => {
        const [rows] = await pool.query(
            "SELECT * FROM products WHERE id = ?",
            [id]
        );
        return rows[0];
    },

    create: async (data) => {
        await pool.query(
            "INSERT INTO products(model, description, quantity, price, imgurl) VALUES (?,?,?,?,?)",
            [data.model, data.description, data.quantity, data.price, data.imgurl]
        );
    },

    update: async (id, data) => {
        await pool.query(
            "UPDATE products SET model=?, description=?, quantity=?, price=?, imgurl=? WHERE id=?",
            [data.model, data.description, data.quantity, data.price, data.imgurl, id]
        );
    },

    delete: async (id) => {
        await pool.query("DELETE FROM products WHERE id=?", [id]);
    }
};

module.exports = Product;
