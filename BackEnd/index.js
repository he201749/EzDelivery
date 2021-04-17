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

https.createServer(options, app).listen(8080, () => {
    console.log('App is running ! Go to https://localhost:8080');
});
http.createServer(app).listen(8081, () => {
    console.log('App is running ! Go to http://localhost:8081');
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
                    (errors, results) => {
                        if (errors) {
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

app.delete("/api/acces/:mail&:boite", (req, res) => {
    let mail=req.params.mail;
    let boite=req.params.boite;

    pool.query(
        "DELETE FROM acces where utilisateur=$1 AND boite=$2",
        [mail,boite],
        (error, results) => {
            if (error) {
                return res.send(error);
            }

            return res.send(true);
        }
    );
});

app.post("/api/acces", (req, res) => {
    let num= Number(req.body.num);
    let mail= req.body.mail;
    let mdp= req.body.mdp;
    let nom= req.body.nom;

    pool.query(
        "select mdp from boites where id=$1",
        [num],
        (error, results) => {
            if (error) {
                return res.send(false);
            }
            if(results.rows.length==0){
                return res.send(false);
            }
            if(mdp!=results.rows[0].mdp){
                return res.send(false)
            }
            else{
                pool.query(
                    "Insert into acces(utilisateur,boite,nom) values ($1,$2,$3)",
                    [mail,num,nom],
                    (errors, results) => {
                        if (errors) {
                            return res.send(false);
                        }
            
                        return res.send(true);
                    }
                );
            }
        }
    );
});

app.post("/api/utilisateurs", (req, res) => {
    let mail= req.body.mail;
    let mdp= req.body.mdp;

    pool.query(
        "select mdp from utilisateurs where mail=$1",
        [mail],
        (error, results) => {
            if (error) {
                return res.send(false);
            }
            if(results.rows.length==0){
                return res.send(false);
            }
            if(mdp!=results.rows[0].mdp){
                return res.send(false);
            }
            if(mdp==results.rows[0].mdp){
                return res.send(true);
            }
        }
    );
});

app.post("/api/newUtilisateurs", (req, res) => {
    let mail= req.body.mail;
    let mdp= req.body.mdp;
    let nom=req.body.nom;
    let prenom= req.body.prenom;


    pool.query(
        "select mail from utilisateurs ",
        (error, results) => {
            if (error) {
                return res.send(false);
            }
            for(let i=0;i<results.rows.length;i++){
                if(results.rows[i].mail==mail){
                    return res.send('existant');
                }
            }
            pool.query(
                "insert into utilisateurs(mail,nom,prenom,mdp) values ($1,$2,$3,$4)",
                [mail,nom,prenom,mdp],
                (errors, results)=>{
                    if (errors) {
                        return res.send(false);
                    }
        
                    return res.send(true);
                }
            )
        }
    );
});



app.put("/api/utilisateurs/nom/:mail", (req, res) => {
    let txt= req.body.txt;
    let mail= req.params.mail;

    pool.query(
        "update utilisateurs set nom=$1 where mail=$2",
        [txt,mail],
        (error, results) => {
            if (error) {
                return res.send(error);
            }

            return res.send(true);
        }
    );
});

app.put("/api/utilisateurs/prenom/:mail", (req, res) => {
    let txt= req.body.txt;
    let mail= req.params.mail;

    pool.query(
        "update utilisateurs set prenom=$1 where mail=$2",
        [txt,mail],
        (error, results) => {
            if (error) {
                return res.send(error);
            }

            return res.send(true);
        }
    );
});

app.put("/api/utilisateurs/mail/:mail", (req, res) => {
    let newmail= req.body.mail;
    let mdp=req.body.mdp;
    let mail= req.params.mail;

    pool.query(
        "select mdp from utilisateurs where mail = $1",
        [mail],
        (error, results) => {
            if (error) {
                return res.send(false);
            }
            if(results.rows.length==0){
                return res.send(false);
            }
            if(results.rows[0].mdp==mdp){
                pool.query(
                    "update utilisateurs set mail=$1 where mail=$2",
                    [newmail,mail],
                    (error2, results2) => {
                        if (error2) {
                            return res.send(false);
                        }
                        return res.send(true);
                    }
                )
            }
            else{
                return res.send(false);
            }
        }
    );
});

app.put("/api/utilisateurs/mdp/:mail", (req, res) => {
    let newmdp= req.body.newmdp;
    let mdp=req.body.mdp;
    let mail= req.params.mail;

    pool.query(
        "select mdp from utilisateurs where mail = $1",
        [mail],
        (error, results) => {
            if (error) {
                return res.send(false);
            }
            if(results.rows.length==0){
                return res.send(false);
            }
            if(results.rows[0].mdp==mdp){
                pool.query(
                    "update utilisateurs set mdp=$1 where mail=$2",
                    [newmdp,mail],
                    (error2, results2) => {
                        if (error2) {
                            return res.send(false);
                        }
                        return res.send(true);
                    }
                )
            }
            else{
                return res.send(false);
            }
        }
    );
});