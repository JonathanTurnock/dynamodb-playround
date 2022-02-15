import { employeeRepo } from "../../src/employee.repo";

const main = async () => {
  await employeeRepo
    .deleteTable()
    .then(() => console.log("Drop Success"))
    .catch(() => console.error("Drop Error"));

  try {
    await employeeRepo.create();
    console.log("Table Created");
  } catch (error) {
    console.error("Table Failed to Create", error);
  }
};

main();
