const express = require("express");
const mysql = require("mysql2/promise");
const dbConfig = require("../../dbConfig");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
      const conn = await mysql.createConnection(dbConfig);
      const sql = `SELECT * FROM pets WHERE archived = 0`;
      const [result] = await conn.query(sql);
      res.send({ msg: "got pets", result });
      await conn.end();
    } catch (error) {
      console.log("/ got error ", error.message);
      res.status(500).send({ error: "Error getting pets" });
    }
  });
  
  router.post("/", async (req, res) => {
    console.log(req.body);
    try {
      const conn = await mysql.createConnection(dbConfig);
      const sql = "INSERT INTO pets(name, dob, client_email) VALUES(?,?,?)";
      const [result] = await conn.execute(sql, Object.values(req.body));
      res.send({ msg: "pet added" });
      await conn.end();
    } catch (error) {
      res.status(500).send({ error: "something went wrong" });
      console.log(error);
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      const id = req.params.id
      const conn = await mysql.createConnection(dbConfig);
      const sql = `
      UPDATE pets SET archived = 1 WHERE id = ?
      `;
      const [result] = await conn.query(sql, id);
      res.send({ msg: "pet archived", result });
      await conn.end();
    } catch (error) {
      console.log("/ got error ", error.message);
      res.status(500).send({ error: "error archiving pet" });
    }
  });

  // PETS FULLY DONE

module.exports = router;
