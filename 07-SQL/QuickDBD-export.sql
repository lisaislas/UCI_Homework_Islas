﻿-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.


CREATE TABLE departments (
    dept_no CHAR(255)   NOT NULL,
    dept_name VARCHAR(255)   NOT NULL,
    CONSTRAINT pk_departments PRIMARY KEY (
        dept_no
     )
);

CREATE TABLE dept_emp (
    emp_no INT   NOT NULL,
    dept_no CHAR(255)   NOT NULL
);

CREATE TABLE dept_manager (
    dept_no CHAR(255)   NOT NULL,
    emp_no INT   NOT NULL
);

CREATE TABLE employees (
    emp_no INT   NOT NULL,
    emp_title CHAR(255)   NOT NULL,
    birth_date DATE   NOT NULL,
    first_name VARCHAR(255)   NOT NULL,
    sex CHAR(255)   NOT NULL,
    hire_date DATE   NOT NULL,
    CONSTRAINT pk_employees PRIMARY KEY (
        emp_no
     )
);

CREATE TABLE salaries (
    emp_no INT   NOT NULL,
    salary INT   NOT NULL
);

CREATE TABLE titles (
    title_id CHAR(255)   NOT NULL,
    title VARCHAR(255)   NOT NULL,
    CONSTRAINT pk_titles PRIMARY KEY (
        title_id
     )
);

ALTER TABLE dept_emp ADD CONSTRAINT fk_dept_emp_emp_no FOREIGN KEY(emp_no)
REFERENCES employees (emp_no);

ALTER TABLE dept_emp ADD CONSTRAINT fk_dept_emp_dept_no FOREIGN KEY(dept_no)
REFERENCES departments (dept_no);

ALTER TABLE dept_manager ADD CONSTRAINT fk_dept_manager_dept_no FOREIGN KEY(dept_no)
REFERENCES departments (dept_no);

ALTER TABLE dept_manager ADD CONSTRAINT fk_dept_manager_emp_no FOREIGN KEY(emp_no)
REFERENCES employees (emp_no);

ALTER TABLE employees ADD CONSTRAINT fk_employees_emp_title FOREIGN KEY(emp_title)
REFERENCES titles (title_id);

ALTER TABLE salaries ADD CONSTRAINT fk_salaries_emp_no FOREIGN KEY(emp_no)
REFERENCES employees (emp_no);

