/****************Utilisateurs********************/

CREATE TABLE utilisateurs(
   mail          varchar(1000)     	NOT NULL,
   nom    	varchar(1000) 		NOT NULL,
   prenom    	varchar(1000) 		NOT NULL,                  
   mdp          varchar(1000)     	NOT NULL,
   CONSTRAINT utilisateurs_pk PRIMARY KEY (mail)
);
ALTER TABLE utilisateurs OWNER to "admin";
/****************Boites********************/

CREATE TABLE boites (
   id   	SERIAL,                
   mdp  	varchar(1000) 		NOT NULL,
   ip           varchar(1000)     	NOT NULL,
   CONSTRAINT boites_pk PRIMARY KEY (id)
);
ALTER TABLE boites OWNER to "admin";
/****************Livraisons********************/

CREATE TABLE livraisons (
   id   	SERIAL,
   numColis     varchar(1000)     	NOT NULL,
   utilisateur  varchar(1000) 		NOT NULL,
   boite    	integer 		NOT NULL,
   nom          varchar(1000)           NOT NULL,                  
   dateDebut  	date 			NOT NULL,
   dateFin  	date,
   cadeau	integer			NOT NULL,	
   CONSTRAINT livraisons_pk PRIMARY KEY (id),
   CONSTRAINT fk_livraisons_utilisateurs FOREIGN KEY(utilisateur) REFERENCES utilisateurs(mail) ON UPDATE CASCADE ON DELETE CASCADE,
   CONSTRAINT fk_livraisons_boites FOREIGN KEY(boite) REFERENCES boites(id) ON UPDATE NO ACTION ON DELETE CASCADE
);
ALTER TABLE livraisons OWNER to "admin";
/****************Acces********************/

CREATE TABLE acces (
   utilisateur  varchar(1000)       	NOT NULL,    
   boite  	integer       		NOT NULL,            
   nom  	varchar(1000) 		NOT NULL,
   CONSTRAINT acces_pk PRIMARY KEY (utilisateur,boite),
   CONSTRAINT fk_acces_utilisateurs FOREIGN KEY(utilisateur) REFERENCES utilisateurs(mail) ON UPDATE CASCADE ON DELETE CASCADE,
   CONSTRAINT fk_acces_boites FOREIGN KEY(boite) REFERENCES boites(id) ON UPDATE NO ACTION ON DELETE CASCADE
);
ALTER TABLE boites OWNER to "admin";