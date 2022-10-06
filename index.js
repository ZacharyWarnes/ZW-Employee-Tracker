const mysql = require('mysql2');
const utils = require('util');
const inquirer = require('inquirer');
const cTable = require('console.table');

require('dotenv').config();



// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: process.env.DB_PASSWORD,
      database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
  );

  db.query = utils.promisify(db.query);

  

  db.connect(err => {
    if (err) throw err;
    start();
  });

  //Start function for application
  
  start = () => {
    console.log('Welcome user! Please answer the following question to start')
    userPrompts();
  }

  //Inquirer prompts to direct the user to the next function

  const userPrompts = () => {
    inquirer
    .prompt ([
        {
            type: 'list',
            name: 'choices',
            message: 'What would you like to do?',
            choices: [
                'View Departments',
                'View Roles',
                'View Employees',
                'Add a Department',
                'Add a Role',
                'Add an Employee',
                'End'
                
            ]
        }
    ]) .then((answers) =>{
        const {choices} = answers;

        if (choices === 'View Departments') {
            viewDepartments();
        }
        if (choices === 'View Roles') {
            viewRoles();
        }
        if (choices === 'View Employees') {
            viewEmployees();
        }
        if (choices === 'Add a Department') {
            createDepartment();
        }
        if (choices === 'Add a Role') {
            createRole();
        }
        if (choices === 'Add an Employee') {
            createEmployee();
        }
        if (choices === 'End') {
            end();
        };
        
    });
  };

// View all departments
viewDepartments = () => {
    // SELECT * FROM department
    const sql = `SELECT * FROM department`;
    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        userPrompts();
    });
};



// View all roles 
viewRoles = () => {
    const sql = `SELECT role.id, role.title, role.`
}
//SELECT * FROM role

//View all employees
//SELECT * FROM employee 

// Create new departments 
//Prompt the user for the "name" of the department
//THEN Run the query 
//INSERT INTO department (name)
//VALUES ("Sales"); 

    //THEN ask the user what they want to do next

//Create a new role 

// function createRole() {

// }

// Get the existing departments from the 'department' table
//View Departments()
    //THEN prompt the user for the "title", "salary", and "department" for the role 

        // THEN Run the query
        //INSERT INTO role (title, salary, department_id)
        //VALUES ("Manager:ex" 120000:ex, 1:ex)
        // replace all examples above w/ question marks for query method

            // THEN ask the user what they want to do next

// const createDepartment = async () => {

//     const department = await db.query("SELECT * FROM department")

//     const departmentChoices = department.map(department => ({
//         name: department.name,
//         value: department.id
//     }));

//     console.log(department);
//     console.log(departmentChoices)

//     const answers = await inquirer.prompt([
//         {
//             message: "What is the name of this department?",
//             name: "name",
//             input: "input"
//         }

//     ]);

//     await db.query("INSERT INTO department (name) VALUE(?)",
//     [answers.name]
    // );

    //Ask the user what they want to do next
    
    // console.log(answers);

    //At about 25 minutes on SQL DAY 3 vid
// }

// createDepartment();
