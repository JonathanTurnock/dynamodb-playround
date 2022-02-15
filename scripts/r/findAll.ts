import { employeeRepo } from "../../src/partiql-employee.repo";

employeeRepo.findAll().then(console.log).catch(console.error);
