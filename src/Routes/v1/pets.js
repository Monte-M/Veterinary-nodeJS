const express = require("express");
const mysql = require("mysql2/promise");
const dbConfig = require("../../dbConfig");
const joi = require("joi");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const conn = await mysql.createConnection(dbConfig);
    let sql = `SELECT * FROM pets WHERE archived = 0`;
    const { pet } = req.query;
    if (pet) {
      sql = `
      SELECT logs.pet_id, logs.description, logs.status
      FROM logs
      WHERE logs.pet_id = ${conn.escape(pet)};
      `;
    }
    const [result] = await conn.query(sql);
    res.send({ msg: "got pets", result });
    await conn.end();
  } catch (error) {
    console.log("/ got error ", error.message);
    res.status(500).send({ error: "Error getting pets" });
  }
});

router.post("/", async (req, res) => {
  const petSchema = joi.object({
    name: joi.string().min(3).max(50).required(),
    dob: joi.date().required(),
    client_email: joi.string().required(),
  });

  let formValid = false;
  try {
    const validationResult = await petSchema.validateAsync(req.body, {
      abortEarly: false,
    });
    formValid = true;
  } catch (err) {
    formValid = false;
    console.log("err", err);
    res.status(400).send({
      error: "please check inputs",
      err: err.details,
    });
  }

  if (!formValid) return;

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
    const id = req.params.id;
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
