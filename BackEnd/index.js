const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;

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

var transporter = nodemailer.createTransport({              
    host: 'smtp.gmail.com',
    auth: {
        user: 'ezdelivery.mail@gmail.com',
        pass: 'R4z3UQwz9X9i'
    },
});

var mailOptions = {                         
    from: 'EzDelivery.mail@gmail.com',
    to: "",
    subject: 'EzDelivery : Réinitialisation de mot de passe',
    text: ''
};

function CreateMail(mail, password) {
    mailOptions.to = mail;
    mailOptions.text = "Voici votre nouveau mot de passe : \n\n" + password+ "\n\n Nous espérons que vous le changerez dès que possible";
    transporter.sendMail(mailOptions, function(error, info){  
            if (error) {
                return false;
            }
    })
}
function strRandom(o) {
    var a = 10,
        b = 'abcdefghijklmnopqrstuvwxyz',
        c = '',
        d = 0,
        e = ''+b;
    if (o) {
      if (o.startsWithLowerCase) {
        c = b[Math.floor(Math.random() * b.length)];
        d = 1;
      }
      if (o.length) {
        a = o.length;
      }
      if (o.includeUpperCase) {
        e += b.toUpperCase();
      }
      if (o.includeNumbers) {
        e += '1234567890';
      }
    }
    for (; d < a; d++) {
      c += e[Math.floor(Math.random() * e.length)];
    }
    return c;
}
  
function spl(text){
    let txt=text.split(' ');
    for(let i=0;i<txt.length;i++){
        if(txt[i].toLowerCase()=='select' || txt[i].toLowerCase()=='from' || txt[i].toLowerCase()=='where' || txt[i].toLowerCase()=='insert' || txt[i].toLowerCase()=='into' || 
        txt[i].toLowerCase()=='alter' || txt[i].toLowerCase()=='table' || txt[i].toLowerCase()=='delete' || txt[i].toLowerCase()=='update' || txt[i].toLowerCase()=='or' || 
        txt[i].toLowerCase()=='and' || txt[i].toLowerCase()=='drop'){
            return(' ');
        }
    }
    return text;
}
app.post('/api/resetPwd/:mail', (req,res)=>{
    let mail= spl(req.params.mail);
    let password= strRandom({
        includeUpperCase: true,
        includeNumbers: true,
        length: 10,
        startsWithLowerCase: true
    });
    bcrypt.hash(password, saltRounds, function(err, hash) {
        if(err){
            return res.send(false)
        }
        pool.query(
            "update utilisateurs set mdp=$1 where mail=$2",
            [hash,mail],
            (error, results) => {
                if (error) {
                    return res.send(false);
                }
                CreateMail(mail, password,res)
                return res.send(true);              
            }
        );
    });
})

function verifyToken(req,res,next){
    const bearerHeader= req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined'){
        const bearer= bearerHeader.split(' ');
        const bearerToken= bearer[1];
        req.token= bearerToken;
        next();
    }else{
        res.send(false);
    }
}

app.get("/api/utilisateurs", verifyToken, (req, res) => {
    jwt.verify(req.token,'b7j3x3MZR',(err,authdata)=>{
        if(err){
            res.send(false)
        }else{
            let mail = authdata.mail;
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
        }
    })
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

app.get("/api/livraisonsmail", verifyToken, (req, res) => {
    jwt.verify(req.token,'b7j3x3MZR',(err,authdata)=>{
        if(err){
            res.send(false)
        }else{
            let mail = authdata.mail;
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
        }
    })
});

app.get("/api/acces", verifyToken,(req, res) => {
    jwt.verify(req.token,'b7j3x3MZR',(err,authdata)=>{
        if(err){
            res.send(false)
        }else{
            let mail = authdata.mail;
            pool.query(
                "SELECT acces.utilisateur as utilisateur, acces.boite as boite, acces.nom as nom, boites.ip as ip FROM acces INNER JOIN boites ON acces.boite=boites.id WHERE acces.utilisateur = $1",
                [mail],
                (error, results) => {
                    if (error) {
                        return res.send(error);
                    }
        
                    return res.send(results.rows);
                }
            );
        }
    })
});

app.delete("/api/livraisons/:id",verifyToken, (req, res) => {
    jwt.verify(req.token,'b7j3x3MZR',(err,authdata)=>{
        if(err){
            res.send(false)
        }else{
            let mail = authdata.mail;
            let id = req.params.id;
            pool.query(
                "DELETE FROM livraisons where id=$1 and utilisateur=$2",
                [id,mail],
                (error, results) => {
                    if (error) {
                        return res.send(error);
                    }
        
                    return res.send(true);
                }
            );
        }
    })
});

app.post("/api/livraisons", verifyToken,(req, res) => {
    jwt.verify(req.token,'b7j3x3MZR',(err,authdata)=>{
        if(err){
            res.send(false)
        }else{
            let mail = authdata.mail;
            let numcolis= spl(req.body.numcolis);
            let boite= Number(req.body.boite);
            let nom= spl(req.body.nom);
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
        }
    })
});

app.post("/api/gift", verifyToken,(req, res) => {
    jwt.verify(req.token,'b7j3x3MZR',(err,authdata)=>{
        if(err){
            res.send(false)
        }else{
            let mail = authdata.mail;
            let numcolis= spl(req.body.numcolis);
            let boite= Number(req.body.boite);
            let mdp=spl(req.body.mdp);
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
    })
});

app.delete("/api/acces/:boite", verifyToken,(req, res) => {
    jwt.verify(req.token,'b7j3x3MZR',(err,authdata)=>{
        if(err){
            res.send(false)
        }else{
            let mail = authdata.mail;
            let boite=spl(req.params.boite);
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
        }
    })
});

app.post("/api/acces",verifyToken, (req, res) => {
    jwt.verify(req.token,'b7j3x3MZR',(err,authdata)=>{
        if(err){
            res.send(false)
        }else{
            let mail = authdata.mail;
            let num= Number(req.body.num);
            let mdp= spl(req.body.mdp);
            let nom= spl(req.body.nom);


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
        }
    })
});

app.post("/api/utilisateurs", (req, res) => {
    let mail= spl(req.body.mail);
    let mdp= spl(req.body.mdp);


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
            bcrypt.compare(mdp, results.rows[0].mdp, function(err, result) {
                if(!result){
                    return res.send(false);
                }
                if(result){
                    jwt.sign({mail},'b7j3x3MZR', (err1,token)=>{
                        res.send(token);
                    })
                }
            });
        }
    );
});

app.post("/api/newUtilisateurs", (req, res) => {
    let mail= spl(req.body.mail);

    let mdp= spl(req.body.mdp);

    let nom=spl(req.body.nom);

    let prenom= spl(req.body.prenom);

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
            bcrypt.hash(mdp, saltRounds, function(err, hash) {
                if(err){
                    return res.send(false)
                }
                pool.query(
                    "insert into utilisateurs(mail,nom,prenom,mdp) values ($1,$2,$3,$4)",
                    [mail,nom,prenom,hash],
                    (errors, results)=>{
                        if (errors) {
                            return res.send(false);
                        }
            
                        return res.send(true);
                    }
                )
            });
        }
    );
});



app.put("/api/utilisateurs/nom", verifyToken,(req, res) => {
    jwt.verify(req.token,'b7j3x3MZR',(err,authdata)=>{
        if(err){
            res.send(false)
        }else{
            let mail = authdata.mail;
            let txt= spl(req.body.txt);
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
        }
    })
});

app.put("/api/utilisateurs/prenom", verifyToken,(req, res) => {
    jwt.verify(req.token,'b7j3x3MZR',(err,authdata)=>{
        if(err){
            res.send(false)
        }else{
            let mail = authdata.mail;
            let txt= spl(req.body.txt);

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
        }
    })
});

app.put("/api/utilisateurs/mail", verifyToken,(req, res) => {
    jwt.verify(req.token,'b7j3x3MZR',(err,authdata)=>{
        if(err){
            res.send(false)
        }else{
            let mail = authdata.mail;
            let newmail= spl(req.body.newmail);

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
        
    })
});

app.put("/api/utilisateurs/mdp",verifyToken, (req, res) => {
    jwt.verify(req.token,'b7j3x3MZR',(err,authdata)=>{
        if(err){
            res.send(false)
        }else{
            let mail = authdata.mail;
            let newmdp= spl(req.body.newmdp);
            let mdp=spl(req.body.mdp);

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
                    bcrypt.compare(mdp, results.rows[0].mdp, function(err, result) {
                        if(!result){
                            return res.send(false);
                        }
                        if(result){
                            bcrypt.hash(newmdp, saltRounds, function(err3, hash) {
                                if(err3){
                                    return res.send(false)
                                }
                                pool.query(
                                    "update utilisateurs set mdp=$1 where mail=$2",
                                    [hash,mail],
                                    (error2, results2) => {
                                        if (error2) {
                                            return res.send(false);
                                        }
                                        return res.send(true);
                                    }
                                )
                            });
                        }
                    });
                }
            );
        }
    })
});

app.delete("/api/utilisateurs",verifyToken, (req, res) => {
    jwt.verify(req.token,'b7j3x3MZR',(err,authdata)=>{
        if(err){
            res.send(false)
        }else{
            let mail = authdata.mail;
            pool.query(
                "delete from utilisateurs where mail = $1",
                [mail],
                (error, results) => {
                    if (error) {
                        return res.send(false);
                    }
                    return res.send(true);
                }
            );
        }
    })
});


app.get("/api/livraisonsmailstatut", verifyToken, (req, res) => {
    jwt.verify(req.token,'b7j3x3MZR',(err,authdata)=>{
        if(err){
            res.send(false)
        }else{
            let mail = authdata.mail;
            pool.query(
                "SELECT * FROM livraisons WHERE utilisateur = $1 AND cadeau=0 ORDER BY datefin DESC",
                [mail],
                (error, results) => {
                    if (error) {
                        return res.send(error);
                    }
        
                    return res.send(results.rows);
                }
            );
        }
    })
});

app.get("/api/livraisonsmailboites", verifyToken, (req, res) => {
    jwt.verify(req.token,'b7j3x3MZR',(err,authdata)=>{
        if(err){
            res.send(false)
        }else{
            let mail = authdata.mail;
            pool.query(
                "SELECT * FROM livraisons WHERE utilisateur = $1 AND cadeau=0 ORDER BY boite",
                [mail],
                (error, results) => {
                    if (error) {
                        return res.send(error);
                    }
        
                    return res.send(results.rows);
                }
            );
        }
    })
});

app.put("/api/modifylivraisons/:id", (req, res) => {
    const { id } = req.params;

    pool.query(
        "UPDATE livraisons SET datefin = CURRENT_DATE WHERE id=$1",
        [id],
        (error, results) => {
            if (error) {
                return res.send(error);
            }

            return res.send(true);
        }
    );
});