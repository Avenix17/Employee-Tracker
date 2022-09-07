const mysql = require("mysql2");
const inquirer = require("inquirer");
const consoleTable = require("console.table");
const promisesql = require("promise-mysql");

// Creating MySQL connection

const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        // Add MySQL password here
        password: '',
        database: 'employee_db'
    },
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
                "View employees by department",
                "Update an employee role",
                "Update employee manager",
                "Delete employee",
                "Delete department",
                "Delete role",
                "Quit",
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
        case "View all departments":
            viewAllDepartments()
            break;

        case "View all employees":
            viewAllEmployees()
            break;

        case "View all roles":
            viewAllRoles()
            break;

        case "Add a department":
            addDepartment()
            break;

        case "Add a role":
            addRole()
            break;

        case "Add an employee":
            addEmployee()
            break;

        case "View employees by department":
            viewByDepartment()
            break;

        case "Update an employee role":
            updateEmployee()
            break;

        case "Update employee manager":
            updateManager()
            break;

        case "Delete employee":
            deleteEmployee()
            break;

        case "Delete department":
            deleteDepartment()
            break;

        case "Delete role":
            deleteRole()
            break;

        case "Quit":
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
    let viewEmployees = `SELECT * FROM employee`
    db.query(viewEmployees, (err, results) => {
        if (err) throw err;

        console.log(`\n`);
        console.table(results);
        mainMenu();
    });
}

// View roles function
function viewAllRoles() {
    let viewRoles = `SELECT * FROM roles`
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

// Add new employee function
function addEmployee() {
    return inquirer
    .prompt(
        {
            type: 'input',
            name: 'first_name',
            message: "What is the employee's first name?",
            validate: function (first_name) {
                if (first_name.length <= 30) {
                    return true;
                } else {
                    console.log('Please enter first name no more than 30 characters!')
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
                    console.log('Please enter last name no more than 30 characters!')
                    return false;
                }
            }
        }

    )
    .then((input) => {
        db.query(
            `INSERT INTO employee (first_name, last_name)
            VALUES ('${input.first_name}', '${input.last_name}');`,
            (err, results) => {
                if (err) throw err;
        
                console.log(`\n`);
                console.log(`${input.first_name} ${input.last_name} added to database!`);
                mainMenu();
            }
        );
    });
};