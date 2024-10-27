// import modules
import inquirer from 'inquirer';
import { pool, connectToDb } from "./db/connection.js";

await connectToDb();

employeePrompts();

// The function that will allow the user to be redirected back to the main prompts:
function employeePrompts() {
    inquirer
      .prompt([
        {
          type: "list",
          name: "prompt",
          message: "What would you like to do?",
          choices: [
            "View All Departments",
            "View All Roles",
            "View All Employees",
            "Add a Department",
            "Add a Role",
            "Add an Employee",
            "Update Employee Role",
            "Exit",
          ],
        },
      ])
      .then((answers) => {
        if (answers.prompt === "View All Departments") {
          pool.query(`SELECT * FROM department`, (err, result) => {
            if (err) throw err;
            console.table(result.rows);
            employeePrompts();
          });
        } else if (answers.prompt === "View All Roles") {
          pool.query(`SELECT * FROM role`, (err, result) => {
            if (err) throw err;
            console.table(result.rows);
            employeePrompts();
          });
        } else if (answers.prompt === "View All Employees") {
          pool.query(`SELECT * FROM employee`, (err, result) => {
            if (err) throw err;
            console.table(result.rows);
            employeePrompts();
          });
        } else if (answers.prompt === "Add a Department") {
          inquirer
            .prompt([
              {
                type: "input",
                name: "department",
                message: "Enter department name:",
                validate: (departmentInput) => !!departmentInput || "Please enter a valid department name.",
              },
            ])
            .then((answers) => {
              pool.query(
                `INSERT INTO department (name) VALUES (?)`,
                [answers.department],
                (err) => {
                  if (err) throw err;
                  console.log(`Successfully added department: ${answers.department}.`);
                  employeePrompts();
                }
              );
            });
        } else if (answers.prompt === "Exit") {
          pool.end();
          console.log("Have a great day!");
        }
      });
  }
  

  