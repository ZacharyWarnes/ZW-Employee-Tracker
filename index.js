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
                'Update an Employee',
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
const viewDepartments = () => {
    const sql = `SELECT * FROM department`;
    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        userPrompts();
    });
};



// View all roles 
const viewRoles = () => {
    const sql = `SELECT role.id, role.title, role.department_id , role.salary`
    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        userPrompts();
    });
};


//View all employees
const viewEmployees = () => {
    const sql = `SELECT employee.id, employee.first_name, role.title, department_name AS department, role.salary FROM employee  FROM employee LEFT JOIN role ON employee.role_id LEFT JOIN department ON role.department_id = department_id`;

    db.query(sql, (err, rows) =>{
        if (err) throw err;
        console.table(rows);
        userPrompts();
    });
};

//Add a Department
const createDepartment = () => {
    inquirer
        .prompt([
        { 
            type: 'input',
            message: 'What is the name of the department you are adding?',
            name: "newDepartment"

        }
  ]) .then(answers => {
    const sql = `INSERT INTO department (name) VALUES (?)`;
    db.query(sql, answers.newDepartment, (err,result) => {
        if (err) throw err;
        console.log(`New Department Added`);
        userPrompts();
    });
  });
};
    

//Create a new role

const createRole = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'What is the title of the new role?',
                name: 'roleTitle'
            },
            {
                type: 'input',
                message: 'What is the salary for this role?',
                name: 'roleSalary'
            },
            {
                type: 'list',
                message: 'What department does this role belong to?',
                choices: department,
                name: 'roleDepartment'
            }
        ])
        .then(answers => { 
            const params = [answers.title, answers.salary, answers.department];
            const selectDepartment = `SELECT name, id FROM department`;
            db.query(selectDepartment, (err,data) => {
                if (err) throw err;
                const department = data.map(({name, id}) => ({name: name, value: id}));  
            })
            params.push(department);
            const sql = `INSERT INTO role (title, salary, department_id) VALUES (?,?,?)`;

            db.query(sql, params, (err, result) => {
                if(err) throw err;
                console.log('Role has been added');
                userPrompts();
            });
        });
};



// Get the existing departments from the 'department' table
//View Departments()
    //THEN prompt the user for the "title", "salary", and "department" for the role 

        // THEN Run the query
        //INSERT INTO role (title, salary, department_id)
        //VALUES ("Manager:ex" 120000:ex, 1:ex)
        // replace all examples above w/ question marks for query method

            // THEN ask the user what they want to do next



// createDepartment();
