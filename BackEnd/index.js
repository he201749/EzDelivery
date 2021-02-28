
const https = require('https');
const fs = require('fs');
const path = require('path');
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.json());

const key = fs.readFileSync(path.join(__dirname,'server.key'));
const cert = fs.readFileSync(path.join(__dirname,'server.cert'));

const options = { key, cert };

https.createServer(options, app).listen(8080, () => {
    console.log('App is running ! Go to https://localhost:8080');
});

const Pool = require("pg").Pool;
const pool = new Pool({
    user: "admin",
    host: "192.168.1.22",
    database: "ezdelivery",
    password: "QW228fjr78gWxU",
    port: 5432
});

app.get("/api/utilisateurs/:mail", (req, res) => {
    const { mail } = req.params;

    pool.query(
        "SELECT nom, prenom, mail FROM utilisateurs WHERE mail = $1",
        [mail],
        (error, results) => {
            if (error) {
                return res.send(error);
            }

            return res.send(results.rows);
        }
    );
});

app.get("/api/livraisons/:boite", (req, res) => {
    const { boite } = req.params;

    pool.query(
        "SELECT numColis FROM livraisons WHERE boite = $1",
        [boite],
        (error, results) => {
            if (error) {
                return res.send(error);
            }

            return res.send(results.rows);
        }
    );
});

