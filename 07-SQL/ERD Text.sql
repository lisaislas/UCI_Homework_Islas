departments
-
dept_no CHAR(255) PK
dept_name VARCHAR(255)

dept_emp
-
emp_no INT FK >- employees.emp_no
dept_no CHAR(255) FK >- departments.dept_no

dept_manager
-
dept_no CHAR(255) FK >- departments.dept_no
emp_no INT FK - employees.emp_no

employees
-
emp_no INT PK
emp_title CHAR(255) FK >- titles.title_id
birth_date DATE
first_name VARCHAR(255)
last_name VARCHAR(255)
sex CHAR(255)
hire_date DATE

salaries
-
emp_no INT FK - employees.emp_no
salary INT

titles
-
title_id CHAR(255) PK
title VARCHAR(255)