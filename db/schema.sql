-- creates a new db from a clean slate and connects to it 
DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

--connects to this database
\c employee_db;

--creates three new tables
--table "role" foreign key references department(id)
-- table "employee" foreign key references role(id)
CREATE TABLE department (
id SERIAL PRIMARY KEY,
name VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE role(
id SERIAL PRIMARY KEY,
title VARCHAR(30) UNIQUE NOT NULL,
salary DECIMAL NOT NULL,
department_id INTEGER NOT NULL 
FOREIGN KEY (department_id)
REFERENCES department(id)
);

CREATE TABLE employee(
id SERIAL PRIMARY KEY,
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
role_id INTEGER NOT NULL 
FOREIGN KEY (role_id)
REFERENCES role(id)
manager_id INTEGER 
);


