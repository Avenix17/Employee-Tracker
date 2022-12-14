const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');
const promisesql = require('promise-mysql');

// Connection info
const connectionInfo =
{
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // Add MySQL password here
    password: '',
    database: 'employee_db'
}


// Creating MySQL connection
const db = mysql.createConnection(
    connectionInfo,
    // Check to see if you are indeed connected to database
    console.log(`Connected to the employee_db database.`),
    mainMenu()
);


// The main menu for user
async function mainMenu() {
    return await inquirer
        .prompt({
            type: 'list',
            name: 'startingQ',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Quit',
            ]
        })
        // calls function to open subMenu based on user selection
        .then((selection) => {
            subMenus(selection)
        })
        .catch((err) => console.log(err));
};

const subMenus = (selection) => {
    switch (selection.startingQ) {
        case 'View all departments':
            viewAllDepartments()
            break;

        case 'View all employees':
            viewAllEmployees()
            break;

        case 'View all roles':
            viewAllRoles()
            break;

        case 'Add a department':
            addDepartment()
            break;

        case 'Add a role':
            addRole()
            break;

        case 'Add an employee':
            addEmployee()
            break;

        case 'Update an employee role':
            updateEmployeeRole()
            break;

        case 'Quit':
            quitEmployeeTracker()
            break;
    };
};

// View departments function
function viewAllDepartments() {
    let viewDepartments = `SELECT * FROM department`
    db.query(viewDepartments, (err, results) => {
        if (err) throw err;

        console.log(`\n`);
        console.table(results);
        mainMenu();
    });
}

// View employees function
function viewAllEmployees() {
    let viewEmployees = `
    SELECT employee.id, employee.first_name, employee.last_name, roles.title, roles.salary, department.department_name, manager.first_name AS acting_manager FROM employee AS employee
    INNER JOIN roles ON employee.role_id=roles.id 
    INNER JOIN department ON roles.department_id=department.id
    INNER JOIN employee AS manager ON employee.manager_id=manager.id`
    db.query(viewEmployees, (err, results) => {
        if (err) throw err;

        console.log(`\n`);
        console.table(results);
        mainMenu();
    });
}

// View roles function
function viewAllRoles() {
    let viewRoles = `
    SELECT roles.id, roles.title, roles.salary, department.department_name FROM roles
    INNER JOIN department ON roles.department_id=department.id`
    db.query(viewRoles, (err, results) => {
        if (err) throw err;

        console.log(`\n`);
        console.table(results);
        mainMenu();
    });
}

// Add new department function
function addDepartment() {
    return inquirer
        .prompt({
            type: 'input',
            name: 'department_name',
            message: 'What is the name of this department?',
            validate: function (department_name) {
                if (department_name.length <= 30) {
                    return true;
                } else {
                    console.log('Please enter name no more than 30 characters!')
                    return false;
                }
            }
        })
        .then((input) => {
            db.query(
                `INSERT INTO department (department_name)
            VALUES ('${input.department_name}');`,
                (err, results) => {
                    if (err) throw err;

                    console.log(`\n`);
                    console.log(`${input.department_name} added to database!`);
                    mainMenu();
                }
            );
        });
};

// Add new role function
function addRole() {
    // Array for departments
    let departmentArr = [];

    // Creates connection using promise-sql
    promisesql.createConnection(connectionInfo)
        .then((connect) => {
            return connect.query('SELECT id, department_name FROM department');
        })
        .then((departments) => {
            // Place all departments in array
            for (i = 0; i < departments.length; i++) {
                departmentArr.push(departments[i].department_name);
            }
            return departments;
        })
        .then((departments) => {
            inquirer.prompt([
                {
                    name: 'rolename',
                    type: 'input',
                    message: 'What is the name of this role?'
                },
                {
                    name: 'salary',
                    type: 'input',
                    message: 'What is the salary for this role?',
                    validate: input => {
                        if (isNaN(input)) {
                            console.log('You must enter a valid salary');
                            return false;
                        } else {
                            return true;
                        }
                    }
                },
                {
                    name: 'dept',
                    type: 'list',
                    message: 'Which department does this role belong to?',
                    choices: departmentArr
                }
            ])
                .then((input) => {

                    // Sets department Id variable
                    let deptId;

                    // gets id of department selected
                    for (i = 0; i < departments.length; i++) {
                        if (input.dept == departments[i].department_name) {
                            deptId = departments[i].id;
                        }
                    }

                    // Adds role to roles table
                    db.query(`INSERT INTO roles (title, salary, department_id)
                VALUES ("${input.rolename}", ${input.salary}, ${deptId})`, (err, res) => {
                        if (err) return err;
                        console.log(`\n ${input.rolename} has been added to the database! \n`);
                        mainMenu();
                    });

                });

        });
};


// Add new employee function
function addEmployee() {

    let roleArr = [];
    let managerArr = [];

    // Create connection using promise-sql
    promisesql.createConnection(connectionInfo)
        .then((connect) => {
            // Query all roles and all managers and pass as a promise
            return Promise.all([
                connect.query('SELECT id, title FROM roles ORDER BY title ASC'),
                connect.query("SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS Employee FROM employee ORDER BY Employee ASC")
            ]);

        }).then(([roles, managers]) => {
            // Roles array
            for (i = 0; i < roles.length; i++) {
                roleArr.push(roles[i].title);
            }
            // Managers array
            for (i = 0; i < managers.length; i++) {
                managerArr.push(managers[i].Employee);
            }
            return Promise.all([roles, managers]);
        })
        .then(([roles, managers]) => {

            // add option for no manager
            managerArr.unshift('--');

            inquirer.prompt([
                {
                    type: 'input',
                    name: 'first_name',
                    message: "What is the employee's first name?",
                    validate: function (first_name) {
                        if (first_name.length <= 30) {
                            return true;
                        } else {
                            console.log(`\n Please enter first name no more than 30 characters! \n `)
                            return false;
                        }
                    }
                },
                {
                    type: 'input',
                    name: 'last_name',
                    message: "What is the employee's last name?",
                    validate: function (last_name) {
                        if (last_name.length <= 30) {
                            return true;
                        } else {
                            console.log(`\n Please enter last name no more than 30 characters! \n `)
                            return false;
                        }
                    }
                },
                {
                    name: 'role',
                    type: 'list',
                    message: 'What is their role?',
                    choices: roleArr
                },
                {
                    name: 'manager',
                    type: 'list',
                    message: 'Who is their manager?',
                    choices: managerArr
                }
            ])
                .then((input) => {
                    // Set variable for Ids
                    let roleId;
                    // Default Manager value as null
                    let managerId = null;

                    // Gets selected role id
                    for (i = 0; i < roles.length; i++) {
                        if (input.role == roles[i].title) {
                            roleId = roles[i].id;
                        }
                    }

                    // Gets selected manager id
                    for (i = 0; i < managers.length; i++) {
                        if (input.manager == managers[i].Employee) {
                            managerId = managers[i].id;
                        }
                    }
                    // Add employee
                    db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
                 VALUES ("${input.first_name}", "${input.last_name}", ${roleId}, ${managerId})`, (err, res) => {
                        if (err) return err;
                        console.log(`\n ${input.first_name} ${input.last_name} has been added to database! \n `);
                        mainMenu();
                    }
                    );
                });
        });
};

// Update employee role function
function updateEmployeeRole() {

    // Employee and role arrays
    let employeeArr = [];
    let roleArr = [];

    // Create connection using promise-sql
    promisesql.createConnection(connectionInfo)
        .then((connect) => {
            return Promise.all([

                // Query all roles and employee
                connect.query('SELECT id, title FROM roles ORDER BY title ASC'),
                connect.query("SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS Employee FROM employee ORDER BY Employee ASC")
            ]);
        }).then(([roles, employees]) => {

            // Roles array
            for (i = 0; i < roles.length; i++) {
                roleArr.push(roles[i].title);
            }

            // Employees array
            for (i = 0; i < employees.length; i++) {
                employeeArr.push(employees[i].Employee);
            }

            return Promise.all([roles, employees]);
        }).then(([roles, employees]) => {

            inquirer.prompt([
                {
                    name: 'employee',
                    type: 'list',
                    message: 'Who would you like to edit?',
                    choices: employeeArr
                }, {
                    name: 'role',
                    type: 'list',
                    message: 'What is their new role?',
                    choices: roleArr
                },
            ])
                .then((input) => {

                    let roleId;
                    let employeeId;

                    // Gets selected role id
                    for (i = 0; i < roles.length; i++) {
                        if (input.role == roles[i].title) {
                            roleId = roles[i].id;
                        }
                    }

                    // Gets selected employee id
                    for (i = 0; i < employees.length; i++) {
                        if (input.employee == employees[i].Employee) {
                            employeeId = employees[i].id;
                        }
                    }

                    // Update employee with new role
                    db.query(`UPDATE employee SET role_id = ${roleId} WHERE id = ${employeeId}`, (err, res) => {
                        if (err) return err;
                        console.log(`\n ${input.employee}'s role has been updated in database! \n `);
                        mainMenu();
                    });
                });
        });

}

// Quits application
function quitEmployeeTracker() {
    console.log('See you later, Alligator!');
    db.end();
};