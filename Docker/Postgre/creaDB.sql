/****************Utilisateurs********************/

CREATE TABLE utilisateurs(
   id   	INTEGER       		NOT NULL,
   nom    	VARCHAR(1000) 		NOT NULL,
   prenom    	VARCHAR(1000) 		NOT NULL,                  
   mail  	VARCHAR(1000) 		NOT NULL,
   mdp          VARCHAR(1000)     	NOT NULL,
   CONSTRAINT utilisateurs_pk PRIMARY KEY (id)
);
ALTER TABLE utilisateurs OWNER to "admin";

/****************Boites********************/

CREATE TABLE boites (
   id   	INTEGER       		NOT NULL,                
   mdp  	VARCHAR(1000) 		NOT NULL,
   ip           VARCHAR(1000)     	NOT NULL,
   CONSTRAINT boites_pk PRIMARY KEY (id)
);
ALTER TABLE boites OWNER to "admin";

/****************Livraisons********************/

CREATE TABLE livraisons (
   id   	INTEGER       		NOT NULL,
   utilisateur  INTEGER 		NOT NULL,
   boite    	INTEGER 		NOT NULL,                  
   dateDebut  	DATE 			NOT NULL,
   dateFin  	DATE 			NOT NULL,
   statut       INTEGER     		NOT NULL,
   cadeau	INTEGER			NOT NULL,
   CONSTRAINT livraisons_pk PRIMARY KEY (id),
   CONSTRAINT fk_livraisons_utilisateurs FOREIGN KEY(utilisateur) REFERENCES utilisateurs(id) ON UPDATE NO ACTION ON DELETE CASCADE,
   CONSTRAINT fk_livraisons_boites FOREIGN KEY(boite) REFERENCES boites(id) ON UPDATE NO ACTION ON DELETE CASCADE
);
ALTER TABLE livraisons OWNER to "admin";

/****************Acces********************/

CREATE TABLE acces (
   utilisateur  INTEGER       		NOT NULL,    
   boite  	INTEGER       		NOT NULL,            
   nom  	VARCHAR(1000) 		NOT NULL,
   CONSTRAINT acces_pk PRIMARY KEY (utilisateur,boite),
   CONSTRAINT fk_acces_utilisateurs FOREIGN KEY(utilisateur) REFERENCES utilisateurs(id) ON UPDATE NO ACTION ON DELETE CASCADE,
   CONSTRAINT fk_acces_boites FOREIGN KEY(boite) REFERENCES boites(id) ON UPDATE NO ACTION ON DELETE CASCADE
);
ALTER TABLE boites OWNER to "admin";