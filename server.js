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
      // TODO: Add MySQL password here
      password: '',
      database: 'employee_db'
    },
    //Check to see if you are indeed connected to database
    console.log(`Connected to the employee_db database.`)
  );