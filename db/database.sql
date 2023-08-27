CREATE DATABASE IF NOT EXISTS companydb;

use companydb;
 
  CREATE TABLE employees (
        id INT(11) NOT NULL AUTO_INCREMENT,
        user_id INT(11) NOT NULL,
        name VARCHAR(45) DEFAULT '',
        salary INT(7) DEFAULT 0,
        PRIMARY KEY (id),
        FOREIGN KEY (user_id) REFERENCES users(id)
    );

describe employee;
 INSERT INTO employee VALUES
 (1,'Joe',1000),
 (2,'Henry',2000),
 (3,'Sam',2500),
 (4 ,'max',1500)

CREATE TABLE users (
    id INT(11) NOT NULL AUTO_INCREMENT,
    name VARCHAR(45) DEFAULT NULL,
    password VARCHAR(45) DEFAULT NULL,
    email VARCHAR(45) DEFAULT NULL,
    avatar INT(1) DEFAULT NULL,
    PRIMARY KEY (id)
);

INSERT INTO users VALUES
(1,'pedro','pedro1234','pedro@gmail.com','3')

