-- creates a new db from a clean slate
DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

--connects to this database
\c employee_db;

--code below creates three new tables:

-- the serial primary key gives each row a unique key
CREATE TABLE department (
id SERIAL PRIMARY KEY,
name VARCHAR(30) UNIQUE NOT NULL
);

--the foreign key in the table below connects to the "department" table above
CREATE TABLE role(
id SERIAL PRIMARY KEY,
title VARCHAR(30) UNIQUE NOT NULL,
salary DECIMAL NOT NULL,
department_id INTEGER NOT NULL 
FOREIGN KEY (department_id)
REFERENCES department(id)
ON DELETE CASCADE
);

-- the role_id column in the table below connects to the "role" table shown above 
CREATE TABLE employee(
id SERIAL PRIMARY KEY,
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
role_id INTEGER NOT NULL 
FOREIGN KEY (role_id)
REFERENCES role(id)
manager_id INTEGER 
FOREIGN KEY (manager_id)
REFERENCES employee(id)
ON DELETE SET NULL
);



