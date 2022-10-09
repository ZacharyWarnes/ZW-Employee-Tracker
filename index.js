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
        if (choices === 'Update an Employee') {
            updateEmployee();
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
    const sql = `SELECT roles.id, roles.title, roles.department_id, roles.salary FROM roles`;
    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        userPrompts();
    });
};


//View all employees
const viewEmployees = () => {
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.name AS department, roles.salary FROM employee LEFT JOIN roles ON employee.role_id LEFT JOIN department ON roles.department_id = department_id`;

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
           
        ])
        .then(answers => { 
            const params = [answers.roleTitle, answers.roleSalary];
            const selectDepartment = `SELECT name, id FROM department`;
            db.query(selectDepartment, (err,data) => {
                if (err) throw err;
                //create a new department choice array to choose from
                const department = data.map(({name, id}) => ({name: name, value: id}));  

                inquirer
                    .prompt([

                        {
                            type: 'list',
                            message: 'What department does this role belong to?',
                            choices: department,
                            name: 'roleDepartment'
                        }

                     ])
                     .then(departmentChoice => {
                        const newDepartment = departmentChoice.department;
                        params.push(newDepartment);

                        const sql = `INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)`;

                        db.query(sql, params, (err, result) => {
                        if(err) throw err;
                        console.log('Role has been added');
                        userPrompts();
                     });
               });
            });
        });
};

//Add a new employee
const createEmployee = () => {
    inquirer 
        .prompt([
            {
                 type:"input",
                 message: "What is the employee's first name?",
                 name: 'fName'
            },
            {
                type: "input",
                message: "What is the employee's last name?",
                name: 'lName'
            }
        ])
        .then(answers => {
            const params = [answers.fName, answers.lName];
            const selectRole = `SELECT roles.id, roles.title FROM roles`;

            db.query(selectRole, (err, data) => {
                if(err) throw err;
                const role = data.map(({id, title}) => ({name: title, value: id}));

                inquirer
                    .prompt([
                        {
                            type:"list",
                            message: "What is the employee's role?",
                            choices: role,
                            name: "empRole"
                        }
                    ])
                    .then(roleChoice =>{
                        const employeeRole = roleChoice.role;
                        params.push(employeeRole);


                // Add employee's manager
                    const selectManager = `SELECT * FROM employee`;
                    db.query(selectManager, (err, data) =>{
                        if(err) throw err;
                        const managers = data.map(({id, first_name, last_name})=> ({name: first_name + "" + last_name, value: id}));

                    inquirer
                        .prompt([
                            {
                                type: 'list',
                                message: "Who is the employee's manager?",
                                choices: managers,
                                name: 'manager'
                            }
                        ])
                        .then(managerChoice => {
                            const manager = managerChoice.manager;
                            params.push(manager);
                            const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;

                            db.query(sql, (err,result) => {
                                if(err) throw err;
                                console.log("New Employee Added");
                                userPrompts();
                            });
                        });
                    });
                });

            });
        });
};

//Code for updating an existing employee
const updateEmployee = () => {
    const selectEmp = `SELECT * FROM employee`;
    db.query(selectEmp, (err, data) => {
        if(err) throw err;
        const employees = data.map(({id, first_name, last_name}) => ({name: first_name + " " + last_name, value: id}));

        inquirer
            .prompt([
                {
                    type: 'list',
                    message: "Which employee profile are you updating?",
                    choices: employees,
                    name: 'updatedEmp'
                }
            ])
            .then(empChoice => {
                const employee = empChoice.updatedEmp;
                //empty array to push updates
                const params = [];
                params.push(employee);

                const selectEmpRole = `SELECT * FROM roles`
                db.query(selectEmpRole, (err, data) => {
                    if (err) throw err;
                    const role = data.map(({id, title}) => ({name: title, value: id}));

                    inquirer
                        .prompt([
                            {
                                type:'list',
                                message: "What is the employee's updated role?",
                                choices: role,
                                name: 'updatedRole'

                            }
                        ])
                        .then(empRoleChoice => {
                            const role = empRoleChoice.updatedRole
                            params.push(role);

                            let employee = params[0]
                            params[0] = role
                            params[1] = employee

                            const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
                            db.query(sql, params, (err, result) => {
                                if(err) throw err;
                                console.log("Employee updated");
                                userPrompts();
                            });

                        });
                });
            });
    }); 
};

const end = () => {
    console.log("Thank you for using this program");
    return;
}
