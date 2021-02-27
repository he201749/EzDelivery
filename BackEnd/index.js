const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.listen(8000, () => {
    console.log(`Server is running.`);
});

const Pool = require("pg").Pool;
const pool = new Pool({
    user: "admin",
    host: "192.168.1.22",
    database: "ezdelivery",
    password: "QW228fjr78gWxU",
    port: 5432
});