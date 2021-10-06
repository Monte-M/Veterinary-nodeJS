const express = require("express");
const mysql = require("mysql2/promise");
const dbConfig = require("../../dbConfig");
const joi = require("joi");

const router = express.Router();

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).send({ error: "no id given" });
  try {
    const conn = await mysql.createConnection(dbConfig);
    const sql = `
    SELECT *
    FROM prescriptions
    INNER JOIN medications
    ON medications.id = prescriptions.medication_id
    WHERE prescriptions.pet_id = ?
      `;
    const [result] = await conn.query(sql, id);
    res.send({ msg: "got pets with logs", result });
    await conn.end();
  } catch (error) {
    console.log("/ got error ", error.message);
    res.status(500).send({ error: "error getting pets and logs" });
  }
});

router.post("/", async (req, res) => {
  const presSchema = joi.object({
    medication_id: joi.number().required(),
    pet_id: joi.number().required(),
    comment: joi.string().min(3).required(),
  });

  let formValid = false;
  try {
    const validationResult = await presSchema.validateAsync(req.body, {
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
