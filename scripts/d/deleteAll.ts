import { map } from "lodash";
import { employeeRepo } from "../../src/partiql-employee.repo";
import { employees } from "../employees";

employeeRepo
  .deleteAll(map(employees, "id"))
  .then(console.log)
  .catch(console.error);
