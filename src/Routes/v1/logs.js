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
    SELECT logs.id, logs.pet_id, pets.name, logs.description, logs.status
    FROM logs
    INNER JOIN pets
    ON pets.id = logs.pet_id
    WHERE logs.pet_id = ?
      `;
    const [result] = await conn.query(sql, id);
    res.send({ msg: "got logs", result });
    await conn.end();
  } catch (error) {
    console.log("/ got error ", error.message);
    res.status(500).send({ error: "error getting pets and logs" });
  }
});

router.post("/", async (req, res) => {
  const logsSchema = joi.object({
    pet_id: joi.number().required(),
    description: joi.string().min(5).required(),
    status: joi.string().min(3).required(),
  });

  let formValid = false;
  try {
    const validationResult = await logsSchema.validateAsync(req.body, {
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
