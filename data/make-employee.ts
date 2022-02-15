import { names, uniqueNamesGenerator } from "unique-names-generator";
import { v4 } from "uuid";
import { random, shuffle, times } from "lodash";
import { writeJsonSync } from "fs-extra";
import { EmployeeEntity } from "../src/employee.entity";
import DateGenerator from "random-date-generator";
let startDate = new Date(1970, 1, 1);
let endDate = new Date(2020, 1, 1);

DateGenerator.getRandomDateInRange(startDate, endDate);

export const makeEmployee = (): EmployeeEntity => ({
  id: v4(),
  firstName: uniqueNamesGenerator({
    dictionaries: [names],
    style: "capital",
    length: 1,
  }),
  lastName: uniqueNamesGenerator({
    dictionaries: [names],
    style: "capital",
    length: 1,
  }),
  department: shuffle([
    "admin",
    "marketing",
    "hr",
    "engineering",
  ])[0] as EmployeeEntity["department"],
  salary: random(25000, 100000),
  startDate: DateGenerator.getRandomDateInRange(
    startDate,
    endDate
  ).toISOString(),
  age: random(18, 65),
});

writeJsonSync("./employees.json", times(100, makeEmployee));
