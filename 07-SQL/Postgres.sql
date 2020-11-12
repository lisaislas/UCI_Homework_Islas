-- List the following details of each employee: employee number, last name, first name, sex, and salary.


SELECT e.emp_no, e.first_name, e.last_name, e.sex, s.salary 
	FROM employees as e
	inner join salaries as s
	on e.emp_no=s.emp_no;
	
--List first name, last name, and hire date for employees who were hired in 1986.

SELECT e.first_name, e.last_name, e.hire_date
	FROM employees e
	where EXTRACT(YEAR FROM e.hire_date) = 1986;
--List the manager of each department with the following information: department number, department name, the manager's employee number, last name, first name

SELECT m.emp_no, m.dept_no, e.first_name, e.last_name, d.dept_name
    FROM dept_manager m
    inner join employees e
    on e.emp_no=m.emp_no
    inner join departments d
    on  m.dept_no= d.dept_no;

--List the department of each employee with the following information: employee number, last name, first name, and department name.

SELECT e.emp_no, e.first_name, e.last_name, de.dept_no, d.dept_name
	FROM employees e
	inner join dept_emp de
	on e.emp_no=de.emp_no
	inner join departments d
	on de.dept_no=d.dept_no;
	
--List first name, last name, and sex for employees whose first name is "Hercules" and last names begin with "B."

SELECT e.first_name, e.last_name, e.sex 
	FROM employees e
	where e.first_name='Hercules' and e.last_name like 'B%';
	
-- List all employees in the Sales department, including their employee number, last name, first name, and department name.

SELECT e.emp_no, e.first_name, e.last_name, d.dept_name
	FROM employees e
	inner join dept_emp de
	on e.emp_no=de.emp_no
	inner join departments d
	on de.dept_no=d.dept_no
	where d.dept_name = 'Sales' ;
	
--Select * from public.departments;
--List all employees in the Sales and Development departments, including their employee number, last name, first name, and department name

SELECT e.emp_no, e.first_name, e.last_name, d.dept_name
	FROM employees e
	inner join dept_emp de
	on e.emp_no=de.emp_no
	inner join departments d
	on de.dept_no=d.dept_no
	where d.dept_name IN ('Sales', 'Development') ;

--In descending order, list the frequency count of employee last names, i.e., how many employees share each last name

SELECT e.last_name, count(e.last_name) as name_count
	FROM employees e
	group by e.last_name
	order by count(e.last_name) desc;