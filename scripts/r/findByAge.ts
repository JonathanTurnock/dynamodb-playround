import { employeeRepo } from "../../src/partiql-employee.repo";

employeeRepo.findAllByAgeRange(20, 30).then(console.log).catch(console.error);
