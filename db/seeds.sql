USE employees_db; 

INSERT INTO department (name)
    VALUES 
        ("Admin"),
        ("Sales"),
        ("Human Resoures");

INSERT INTO roles (title, salary, department_id)
VALUES
('CEO', 120000, 1),
('CFO', 100000, 1),
('VP of Marketing', 80000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Steve', 'Jobs', 1, null),
('Tim', 'Cook', 2, 1),
('Ladder', 'Climber', 3, 1);