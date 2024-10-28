// Import modules
import inquirer from "inquirer";
import { pool, connectToDb } from "./db/connection.js";

await connectToDb();

console.log(`------The Office Employee Tracker------`);

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
          "Delete an Employee",
          "Exit",
        ],
      },
    ])
    .then((answers) => {
      if (answers.prompt === "View All Departments") {
        pool.query(`SELECT * FROM department`, (err, result) => {
          if (err) throw err;
          console.table(result.rows); // Shows table from the database.
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
              validate: (departmentInput) =>
                !!departmentInput || "Please enter a valid department name.", // Show message if response was left blank
            },
          ])
          .then((answers) => {
            pool.query(
              `INSERT INTO department (name) VALUES ($1)`,
              [answers.department],
              (err) => {
                if (err) throw err;
                console.log(
                  `Successfully added department: ${answers.department}.`
                );
                employeePrompts();
              }
            );
          });
      } else if (answers.prompt === "Add a Role") {
        // Fetch the departments from the database
        pool.query("SELECT id, name FROM department", (err, result) => {
          if (err) throw err;

          // Create choices from the result
          const departmentChoices = result.rows.map((department) => ({
            name: department.name, // Display name
            value: department.id, // Value is the id for foreign key
          }));
          inquirer
            .prompt([
              {
                type: "input",
                name: "role",
                message: "Enter name of role:",
                validate: (roleInput) =>
                  !!roleInput || "Please enter a valid role name.",
              },
              {
                type: "input",
                name: "salary",
                message: "Enter the salary for this role:",
                validate: (salaryInput) =>
                  !!salaryInput || "Please enter a valid salary amount.",
              },
              {
                type: "list",
                name: "department_id",
                message: "Which department does the role belong to?",
                choices: departmentChoices,
              },
            ])
            .then((answers) => {
              pool.query(
                "INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)",
                [answers.role, answers.salary, answers.department_id],
                (err) => {
                  if (err) throw err;
                  console.log(`Successfully added role: ${answers.role}.`);
                  employeePrompts();
                }
              );
            });
        });
      } else if (answers.prompt === "Add an Employee") {
        pool.query("SELECT id, title FROM role", (err, result) => {
          if (err) throw err;
          // Create choices from the result for roles
          const roleChoices = result.rows.map((role) => ({
            name: role.title,
            value: role.id,
          }));
          // Prompt for employee details
          inquirer
            .prompt([
              {
                type: "input",
                name: "firstName",
                message: "Enter the employee's first name:",
                validate: (firstNameInput) =>
                  !!firstNameInput || "Please enter a valid first name.",
              },
              {
                type: "input",
                name: "lastName",
                message: "Enter the employee's last name:",
                validate: (lastNameInput) =>
                  !!lastNameInput || "Please enter a valid last name.",
              },
              {
                type: "list",
                name: "role_id",
                message: "Select the employee's role:",
                choices: roleChoices,
              },
              {
                type: "input",
                name: "manager_id",
                message: "Enter the manager's ID (leave blank if none):",
                validate: (managerIdInput) =>
                  !managerIdInput ||
                  !isNaN(managerIdInput) ||
                  "Please enter a valid manager ID.",
              },
            ])
            .then((answers) => {
              // Prepare the values for the query
              const values = [
                answers.firstName,
                answers.lastName,
                answers.role_id,
                answers.manager_id ? answers.manager_id : null, // Use null if no manager ID provided
              ];

              // Insert new employee into the database
              pool.query(
                "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)",
                values,
                (err) => {
                  if (err) throw err;
                  console.log(
                    `Successfully added employee: ${answers.firstName} ${answers.lastName}.`
                  );
                  employeePrompts();
                }
              );
            });
        });
      } else if (answers.prompt === "Update Employee Role") {
        // Fetch the list of employees from the database
        pool.query(
          "SELECT id, first_name, last_name FROM employee",
          (err, result) => {
            if (err) throw err;

            // Create choices from the result for employees
            const employeeChoices = result.rows.map((employee) => ({
              name: `${employee.first_name} ${employee.last_name}`, // Display name
              value: employee.id, // Value is the employee id
            }));

            // Prompt for employee selection
            inquirer
              .prompt([
                {
                  type: "list",
                  name: "employee_id",
                  message: "Select the employee to update:",
                  choices: employeeChoices,
                },
              ])
              .then((answers) => {
                // Fetch the roles for the selected employee
                return pool.query("SELECT id, title FROM role");
              })
              .then((roleResult) => {
                // Create choices for roles
                const roleChoices = roleResult.rows.map((role) => ({
                  name: role.title,
                  value: role.id,
                }));

                // Prompt for role selection
                return inquirer.prompt([
                  {
                    type: "list",
                    name: "role_id",
                    message: "Select the new role:",
                    choices: roleChoices,
                  },
                ]);
              })
              .then((roleAnswers) => {
                // Prepare the update query
                const query = `UPDATE employee SET role_id = $1 WHERE id = $2`;

                // Execute the update query with the selected employee and new role
                pool.query(
                  query,
                  [roleAnswers.role_id, answers.employee_id],
                  (err) => {
                    if (err) throw err;
                    console.log("Successfully updated the employee's role.");
                    employeePrompts();
                  }
                );
              })
              .catch((err) => {
                console.error("An error occurred:", err);
              });
          }
        );
      } else if (answers.prompt === "Delete an Employee") {
        // Fetch the list of employees from the database
        pool.query(
          "SELECT id, first_name, last_name FROM employee",
          (err, result) => {
            if (err) throw err;

            // Create choices from the result for employees
            const employeeChoices = result.rows.map((employee) => ({
              name: `${employee.first_name} ${employee.last_name}`, // Display name
              value: employee.id, // Value is the employee id
            }));

            // Prompt for employee selection to delete
            inquirer
              .prompt([
                {
                  type: "list",
                  name: "employee_id",
                  message: "Select the employee to delete:",
                  choices: employeeChoices,
                },
                {
                  type: "confirm",
                  name: "confirmDelete",
                  message: "Are you sure you want to delete this employee?",
                  default: false,
                },
              ])
              .then((answers) => {
                // Proceed only if the user confirms the deletion
                if (answers.confirmDelete) {
                  const deleteQuery = `DELETE FROM employee WHERE id = $1`;
                  return pool.query(deleteQuery, [answers.employee_id]);
                } else {
                  console.log("Deletion cancelled.");
                  return Promise.reject("Deletion cancelled by user.");
                }
              })
              .then(() => {
                console.log("Successfully deleted the employee.");
                employeePrompts();
              })
              .catch((err) => {
                console.error("An error occurred:", err);
              });
          }
        );
      } else if (answers.prompt === "Exit") {
        pool.end();
        console.log("Have a great day!"); //Exit message
      }
    });
}
