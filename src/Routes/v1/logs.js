const express = require("express");
const mysql = require("mysql2/promise");
const dbConfig = require("../../dbConfig");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
      const conn = await mysql.createConnection(dbConfig);
      const sql = `
      SELECT logs.pet_id AS 'Pet ID', pets.name AS 'Name' , pets.dob AS 'Date of Birth', pets.client_email AS 'Client Email', logs.description AS 'Description', logs.status AS 'Status'
      FROM logs
      INNER JOIN pets
      ON logs.pet_id = pets.id
      `;
      const [result] = await conn.query(sql);
      res.send({ msg: "got pets with logs", result });
      await conn.end();
    } catch (error) {
      console.log("/ got error ", error.message);
      res.status(500).send({ error: "error getting pets and logs" });
    }
  });
  
  router.post("/", async (req, res) => {
    console.log(req.body);
    try {
      const conn = await mysql.createConnection(dbConfig);
      const sql = "INSERT INTO logs(pet_id, description, status) VALUES(?,?,?)";
      const [result] = await conn.execute(sql, Object.values(req.body));
      res.send({ msg: "log added" });
      await conn.end();
    } catch (error) {
      res.status(500).send({ error: "something went wrong" });
      console.log(error);
    }
  });

module.exports = router;
