// import modules
import inquirer from 'inquirer';
import pool from './db/connection.js';

// logs messages to advise if the connection was sucessful or failed:
pool.connect(err => {
  if (err) throw err;
  console.log('Database successfully connected.');
  employeePrompts();
});

// The function that will allow the user to be redirected back to the main prompts:
const employeePrompts = function () {

// Using the inquirer package, list options for the user to navigate to:
  inquirer.prompt([{
    type: 'list',
    message: 'What would you like to do?',
    choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update Employee Role', 'Exit']
  }])
  .then((answers) => {
    if (answers.prompt === 'View All Departments') {
// pool.query directs the server to view the departments table, and if there is an error, the error message will be displayed.
      pool.query(`SELECT * FROM department`, (err, result) => {
          if (err) throw err;
          console.table(result);
          employeePrompts();
      });

  } else if (answers.prompt === 'View All Roles') {
// pool.query directs the server to view the roles table, and if there is an error, the error message will be displayed.
      pool.query(`SELECT * FROM role`, (err, result) => {
          if (err) throw err;
          console.table(result);
          employeePrompts();
      });


  } else if (answers.prompt === 'View All Employees') {
// pool.query directs the server to the employees table, and if there is an error, the error message will be displayed.
      pool.query(`SELECT * FROM employee`, (err, result) => {
          if (err) throw err;
          console.table(result);
          employeePrompts();
      });


  } else if (answers.prompt === 'Add a Department') {
// When selected, the user is asked to enter a name. The response is validated. If no name is entered, a logged message appears.
      inquirer.prompt([{
          type: 'input',
          name: 'department',
          message: 'Enter department name:',
          validate: departmentInput => {
              if (!departmentInput) {
                  console.log('Invalid department name. Please try again:');
                  return false;
              } else {
                return true;
              }
          }
      }])
      .then((answers) => {
// The user response is added to the table, and the prompts restart when the function is called.
          pool.query(`INSERT INTO department (name) VALUES (?)`, [answers.department], (err, result) => {
              if (err) throw err;
              console.log(`Successfully added new department: ${answers.department}.`);
              employeePrompts();
          });
      })


  } else if (answers.prompt === 'Add A Role') {
// pool.query directs the server to view the department table, in which the role belongs to, and if there is an error, the error message will be displayed.
      pool.query(`SELECT * FROM department`, (err, result) => {
          if (err) throw err;
          inquirer.prompt([{
                  type: 'input',
                  name: 'role',
                  message: 'Enter name of role:',
// When selected, the following questions are asked. The responses are validated. If no role name, salary, or department is entered, a logged message appears.
                  validate: roleInput => {
                      if (!roleInput) {
                        console.log('Invalid role name. Please try again:');
                          return false;
                      } else {
                          return true;
                      }
                  }
              },
              {
// Add salary
                  type: 'input',
                  name: 'salary',
                  message: 'What is the salary of the role?',
                  validate: salaryInput => {
                      if (!salaryInput) {
                        console.log('Invalid salary. Please try again:');
                          return false;
                      } else {
                          return true;
                      }
                  }
              },
              {
// push new department entered by user to list of departments
                  type: 'list',
                  name: 'department',
                  message: 'Which department does the role belong to?',
                  choices: () => {
                      const roleNames = [];
                      for (let i = 0; i < result.length; i++) {
                          roleNames.push(result[i].name);
                      }
                      return roleNames;
                  }
              }
          ]).then((answers) => {
              for (let i = 0; i < result.length; i++) {
                  if (result[i].name === answers.department) {
                      const department = result[i];
                  }

//Adds role, salary, and department id created by the user into the "role" table.
              pool.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [answers.role, answers.salary, department.id], (err, result) => {
                  if (err) throw err;
                  console.log(`Added ${answers.role} to the database.`);
                  employeePrompts();
              });
          }})
      });

// if the user chooses to add an employee, pool.query directs the server to view the employee table and if there is an error, the error message will be displayed.     
  } else if (answers.prompt === 'Add An Employee') {
      pool.query(`SELECT * FROM employee, role`, (err, result) => {
          if (err) throw err;
          inquirer.prompt([
// When selected, a series of questions are asked. The responses are validated. If no response is entered, a logged message appears.           
              {
                  type: 'input',
                  name: 'firstName',
                  message: 'Enter the employees first name',
                  validate: firstNameInput => {
                      if (!firstNameInput) {
                        console.log('Invalid name. Please try again:');
                          return false;
                      } else {
                          return true;
                      }
                  }
              },
              {
                  type: 'input',
                  name: 'lastName',
                  message: 'What is the employees last name?',
                  validate: lastNameInput => {
                      if (!lastNameInput) {
                        console.log('Invalid last name. Please try again:');
                          return false;
                      } else {
                          return true;
                      }
                  }
              },
              {
                  type: 'list',
                  name: 'role',
                  message: 'What is the employees role?',
                  choices: () => {
                      let roleArray = [];
                      for (let i = 0; i < result.length; i++) {
                        roleArray.push(result[i].title);
                      }
                      const newArray = [...new Set(array)];
                      return newArray;
                  }
              },
              {
                  type: 'input',
                  name: 'manager',
                  message: 'Who is the employees manager?',
                  validate: managerInput => {
                      if (managerInput) {
                        return true;
                    } else {
                        return false;
                    }
                  }
              }
          ]).then((answers) => {
              for (let i = 0; i < result.length; i++) {
                  if (result[i].title === answers.role) {
                      const role = result[i];
                  }
              }
// Add inputs from user into the employee table from the database
              pool.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [answers.firstName, answers.lastName, role.id, answers.manager.id], (err, result) => {
                  if (err) throw err;
                  console.log(`Added ${answers.firstName} ${answers.lastName} to the database.`);
                  employeePrompts();
              });
          })
      });
  } else if (answers.prompt === 'Update An Employee Role') {
      pool.query(`SELECT * FROM employee, role`, (err, result) => {
          if (err) throw err;
          inquirer.prompt([
              {
                  type: 'list',
                  name: 'employee',
                  message: 'Which employees role do you want to update?',
                  choices: () => {
                      const roleArray = [];
                      for (let i = 0; i < result.length; i++) {
                        roleArray.push(result[i].last_name);
                      }
                      const employeeArray = [...new Set(roleArray)];
                      return employeeArray;
                  }
              },
              {
                  type: 'list',
                  name: 'role',
                  message: 'What is their new role?',
                  choices: () => {
                      const roleArray = [];
                      for (let i = 0; i < result.length; i++) {
                        roleArray.push(result[i].title);
                      }
                      const newArray = [...new Set(array)];
                      return newArray;
                  }
              }
          ]).then((answers) => {
              for (let i = 0; i < result.length; i++) {
                  if (result[i].last_name === answers.employee) {
                      const name = result[i];
                  }
              }

              for (let i = 0; i < result.length; i++) {
                  if (result[i].title === answers.role) {
                      const role = result[i];
                  }
              }

              pool.query(`UPDATE employee SET ? WHERE ?`, [{role_id: role}, {last_name: name}], (err, result) => {
                  if (err) throw err;
                  console.log(`Success! Updated ${answers.employee} role to the database.`)
                  employeePrompts();
              });
          })
      });


  } else if (answers.prompt === 'Exit') {
      pool.end();
      console.log("Have a great day!");
  }
})

};