const express = require("express");
const mysql = require("mysql2/promise");
const dbConfig = require("../../dbConfig");
const joi = require("joi");

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
  const medsSchema = joi.object({
    name: joi.string().min(3).max(50).required(),
    description: joi.string().min(5),
  });

  let formValid = false;
  try {
    const validationResult = await medsSchema.validateAsync(req.body, {
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
