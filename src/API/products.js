const express = require("express");
const mysql = require("mysql2/promise");
const dbConfig = require("../dbConfig");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const conn = await mysql.createConnection(dbConfig);
    const sql = `SELECT * FROM products`;
    const [result] = await conn.query(sql);
    res.send({ msg: "got products", result });
    await conn.end();
  } catch (error) {
    console.log("/ got error ", error.message);
    res.status(500).send({ error: "Error getting products" });
  }
});

router.post("/add", async (req, res) => {
  console.log(req.body);
  try {
    const conn = await mysql.createConnection(dbConfig);
    const sql = "INSERT INTO products(title, image, price) VALUES(?,?,?)";
    const [result] = await conn.execute(sql, Object.values(req.body));
    res.send({ msg: "product added" });
    await conn.end();
  } catch (error) {
    res.status(500).send({ error: "Something went wrong" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id
    const conn = await mysql.createConnection(dbConfig);
    const sql = `SELECT * FROM products WHERE id = ?`;
    const [result] = await conn.query(sql, id);
    res.send({ msg: "got single product", result });
    await conn.end();
  } catch (error) {
    console.log("/ got error ", error.message);
    res.status(500).send({ error: "Error getting products" });
  }
});

router.get("/orders/:id", async (req, res) => {
  try {
    const id = req.params.id
    const conn = await mysql.createConnection(dbConfig);
    const sql = `
    SELECT orders.id AS 'Order ID', orders.customer_name AS 'Customer Name', orders.customer_email AS 'Customer Email', products.title AS 'Product Title', products.image AS 'Product Image', products.price AS 'Product Price'
    FROM orders
    INNER JOIN products
    ON orders.product_id = products.id
    WHERE orders.id = ?
    `;
    const [result] = await conn.query(sql, id);
    res.send({ msg: "got single product", result });
    await conn.end();
  } catch (error) {
    console.log("/ got error ", error.message);
    res.status(500).send({ error: "Error getting products" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id
    const conn = await mysql.createConnection(dbConfig);
    const sql = `
    DELETE FROM products where id = ?
    `;
    const [result] = await conn.query(sql, id);
    res.send({ msg: "product deleted", result });
    await conn.end();
  } catch (error) {
    console.log("/ got error ", error.message);
    res.status(500).send({ error: "Error deleting product" });
  }
});

module.exports = router;
