import { employeeRepo } from "../../src/employee.repo";
import { employees } from "../employees";

employeeRepo.saveAll(employees).then(console.log).catch(console.error);
