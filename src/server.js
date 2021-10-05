const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

// routes
const petsRoute = require("./Routes/v1/pets");
const medicationsRoute = require("./Routes/v1/medications");
const logsRoute = require("./Routes/v1/logs");
const prescriptionsRoute = require("./Routes/v1/prescriptions");

const PORT = process.env.SERVER_PORT || 3000;

const dbConfig = require("./dbConfig");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const conn = await mysql.createConnection(dbConfig);
    res.send({ msg: "Connected" });
    await conn.end();
  } catch (error) {
    console.log("/ got error", error.message);
    res.status(500).send({ error: "Something went wrong" });
  }
});

app.use("/v1/pets", petsRoute);
app.use("/v1/meds", medicationsRoute);
app.use("/v1/logs", logsRoute);
app.use("/v1/prescriptions", prescriptionsRoute);

app.listen(PORT, console.log(`Server is running on port ${PORT}`));
