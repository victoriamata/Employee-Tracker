INSERT INTO department (name)
VALUES ('Management'),
       ('Sales'),
       ('Accounting'),
       ('Human Resources'),
       ('Reception'),
       ('Warehouse'),
       ('Customer Service');

INSERT INTO role (title, salary, department_id)
VALUES ('Receptionist', 35,000, 5),
       ('Assistant To The Regional Manager', 40,000, 1),
       ('Sales Representative', 40,000, 2),
       ('Warehouse Associate', 45,000, 6),
       ('Accountant', 45,000, 3),
       ('Regional Manager', 55,000, 1),
       ('HR Representative', 58,000, 4),
       ('Customer Service Representative', 35,000, 6);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Dwight', 'Schrute', 2, 3),
       ('Pam', 'Halpert', 3, 3),
       ('Michael', 'Scott', 6, NULL),
       ('Darryl', 'Philbin', 4, NULL),
       ('Holly', 'Flax', 7, NULL),
       ('Kelly', 'Kapoor', 8, 3),
       ('Jim', 'Halpert', 3, 3),
       ('Toby', 'Flenderson', 7, NULL),
       ('Andy', 'Bernard', 3, 3),
       ('Stanley', 'Hudson', 3, 3),
       ('Kevin', 'Malone', 5, 3),
       ('Angela', 'Martin', 5, 3),
       ('Oscar', 'Martinez', 5, 3),
       ('Erin', 'Hannon', 1, 3)


       