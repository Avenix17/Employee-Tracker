INSERT INTO department (department_name)
VALUES  ('Marketing'),
        ('Too Cool 4 Skool'),
        ('Development'),
        ('Social Media'),
        ('Accounting'),
        ('Testing');


INSERT INTO roles (title, salary, department_id)
VALUES  ('CEO', 100000, 2),
        ('Zany Man', 4000, 6),
        ('Party Animal', 8000, 5),
        ('Builder', 400, 4),
        ('Loyal Henchman', 18000, 1),
        ('Lackey', 6300, 4),
        ('Tired of existence', 7010, 1),
        ('BS Detector', 16000, 3);

  

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ('Jeffrey', 'Bezos', 1, null),
        ('Bob', 'Bobart', 3, null),
        ('Derek', 'Zoolander', 2, null),
        ('Sally', 'May', 4, null),
        ('Yas', 'Queen', 6, null),
        ('Regina', 'George', 3, null),
        ('Percy', 'Jackson', 7, null);

UPDATE employee set manager_id = 4 where id = 2;
UPDATE employee set manager_id = 7 where id = 3;
UPDATE employee set manager_id = 5 where id = 4;
UPDATE employee set manager_id = 5 where id = 5;
UPDATE employee set manager_id = 4 where id = 6;
UPDATE employee set manager_id = 4 where id = 7;