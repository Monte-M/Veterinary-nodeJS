const express = require("express");
const mysql = require("mysql2/promise");
const dbConfig = require("../../dbConfig");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
      const conn = await mysql.createConnection(dbConfig);
      const sql = `SELECT * FROM medications`;
      const [result] = await conn.query(sql);
      res.send({ msg: "got medications", result });
      await conn.end();
    } catch (error) {
      console.log("/ got error ", error.message);
      res.status(500).send({ error: "error getting medications" });
    }
  });
  
  router.post("/", async (req, res) => {
    console.log(req.body);
    try {
      const conn = await mysql.createConnection(dbConfig);
      const sql = "INSERT INTO medications(name, description) VALUES(?,?)";
      const [result] = await conn.execute(sql, Object.values(req.body));
      res.send({ msg: "medication added" });
      await conn.end();
    } catch (error) {
      res.status(500).send({ error: "something went wrong" });
      console.log(error);
    }
  });

module.exports = router;
