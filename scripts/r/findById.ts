import { employeeRepo } from "../../src/partiql-employee.repo";
import { employees } from "../employees";

employeeRepo.findById(employees[0].id).then(console.log).catch(console.error);
