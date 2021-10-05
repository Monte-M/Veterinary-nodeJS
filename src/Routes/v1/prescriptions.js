const express = require("express");
const mysql = require("mysql2/promise");
const dbConfig = require("../../dbConfig");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const conn = await mysql.createConnection(dbConfig);
    const sql = `
      SELECT prescriptions.pet_id AS 'pet ID', prescriptions.comment,
      pets.name, pets.dob AS 'date of birth', pets.client_email AS 'client email',
      medications.name AS 'medication name', medications.description
      FROM prescriptions
      INNER JOIN pets
      ON prescriptions.pet_id = pets.id
      INNER JOIN medications
      ON prescriptions.medication_id = medications.id
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
    const sql =
      "INSERT INTO prescriptions(medication_id, pet_id, comment) VALUES(?,?,?)";
    const [result] = await conn.execute(sql, Object.values(req.body));
    res.send({ msg: "prescription added" });
    await conn.end();
  } catch (error) {
    res.status(500).send({ error: "something went wrong" });
    console.log(error);
  }
});

module.exports = router;
