export interface EmployeeEntity {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  startDate: string;
  salary: number;
  department: "admin" | "marketing" | "hr" | "engineering";
}
