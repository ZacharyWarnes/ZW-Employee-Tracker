const mysql = require('mysql2');

// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: 'passwurd1234!',
      database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
  );

// View all departments
// SELECT * FROM department

// View all roles 
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

// Get the existing departments from the 'department' table

    //THEN prompt the user for the "title", "salary", and "department" for the role 

        // THEN Run the query
        //INSERT INTO role (title, salary, department_id)
        //VALUES ("Manager:ex" 120000:ex, 1:ex)
        // replace all examples above w/ question marks for query method

            // THEN ask the user what they want to do next