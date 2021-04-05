const http = require('http');
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
/*
https.createServer(options, app).listen(8080, () => {
    console.log('App is running ! Go to https://localhost:8080');
});*/
http.createServer(app).listen(8080, () => {
    console.log('App is running ! Go to http://localhost:8080');
});


const Pool = require("pg").Pool;
const pool = new Pool({
    user: "admin",
    host: "51.91.102.255",
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
        "SELECT id,numColis,dateFin FROM livraisons WHERE boite = $1",
        [boite],
        (error, results) => {
            if (error) {
                return res.send(error);
            }

            return res.send(results.rows);
        }
    );
});
app.put("/api/livraisons/:id", (req, res) => {
    const { id } = req.params;

    pool.query(
        "UPDATE livraisons SET datefin = CURRENT_DATE WHERE id=$1",
        [id],
        (error, results) => {
            if (error) {
                return res.send(error);
            }

            return res.send(results.rows);
        }
    );
});

app.get("/api/livraisons/mail/:mail", (req, res) => {
    const { mail } = req.params;

    pool.query(
        "SELECT * FROM livraisons WHERE utilisateur = $1 AND cadeau=0 ORDER BY id DESC",
        [mail],
        (error, results) => {
            if (error) {
                return res.send(error);
            }

            return res.send(results.rows);
        }
    );
});

app.get("/api/acces/:mail", (req, res) => {
    const { mail } = req.params;

    pool.query(
        "SELECT * FROM acces WHERE utilisateur = $1",
        [mail],
        (error, results) => {
            if (error) {
                return res.send(error);
            }

            return res.send(results.rows);
        }
    );
});

app.delete("/api/livraisons/:id", (req, res) => {
    const { id } = req.params;

    pool.query(
        "DELETE FROM livraisons where id=$1",
        [id],
        (error, results) => {
            if (error) {
                return res.send(error);
            }

            return res.send(true);
        }
    );
});

app.post("/api/livraisons", (req, res) => {
    let numcolis= req.body.numcolis;
    let mail= req.body.mail;
    let boite= Number(req.body.boite);
    let nom= req.body.nom;
    let cadeau= Number(req.body.cadeau);

    pool.query(
        "insert into livraisons (numcolis,utilisateur,boite,nom,datedebut,cadeau) values ($1,$2,$3,$4,NOW(),$5)",
        [numcolis,mail,boite,nom,cadeau],
        (error, results) => {
            if (error) {
                return res.send(error);
            }

            return res.send(true);
        }
    );
});

app.post("/api/gift", (req, res) => {
    try{
    let numcolis= req.body.numcolis;
    let boite= Number(req.body.boite);
    let mdp=req.body.mdp;
    let mail= req.body.mail;

    let allboites;
    let good=false;
    pool.query(
        "SELECT * FROM boites",
        (error, results) => {
            if (error) {
                return res.send(error);
            }

            allboites=results.rows;
            for(let i=0;i<allboites.length;i++){
                if(boite==allboites[i].id){
                    if(allboites[i].mdp==mdp){
                        good=true;
                    }
                }
            }
            if(good){
                pool.query(
                    "insert into livraisons (numcolis,utilisateur,boite,nom,datedebut,cadeau) values ($1,$2,$3,'cadeau',NOW(),1)",
                    [numcolis,mail,boite],
                    (error, results) => {
                        if (error) {
                            return res.send(error);
                        }
        
                        return res.send(true);
                    }
                );
            }
            else{
                return res.send(false);
            }
        }
    );
    }
    catch(error){
        return res.send(error);
    }
});


