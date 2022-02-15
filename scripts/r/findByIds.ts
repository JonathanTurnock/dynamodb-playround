import { employeeRepo } from "../../src/partiql-employee.repo";
import employees from "../../data/employees.json";

employeeRepo
  .findByIds([
    employees[0].id,
    employees[1].id,
    employees[2].id,
    employees[3].id,
  ])
  .then(console.log)
  .catch(console.error);
