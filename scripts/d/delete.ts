import { employeeRepo } from "../../src/employee.repo";
import { employees } from "../employees";

employeeRepo.delete(employees[0].id).then(console.log).catch(console.error);
