import { docClient, dynamo } from "../scripts/dynamo";
import { EmployeeEntity } from "./employee.entity";
import { chunk } from "lodash";
import { DynamoDB } from "aws-sdk";

const executeStatement = async (
  statement: DynamoDB.Types.ExecuteStatementInput
) => {
  const { Items } = await dynamo.executeStatement(statement).promise();
  return Items?.map((it) => DynamoDB.Converter.unmarshall(it));
};

export class PartiqlEmployeeRepo {
  private readonly table = "Employees";

  private readonly batchWriteLimit = 25;

  async findById(id: string) {
    const Statement = `SELECT * FROM ${this.table} WHERE id = ${id}`;

    return executeStatement({ Statement });
  }

  async findByIds(ids: string[]) {
    const idsList = `'${ids.join("','")}'`;
    const Statement = `SELECT * FROM ${this.table} WHERE id in (${idsList})`;

    return executeStatement({ Statement });
  }

  async findAll() {
    const Statement = `SELECT * FROM ${this.table}`;
    return executeStatement({ Statement });
  }

  async findAllByAgeRange(min, max) {
    const Statement = `SELECT * FROM ${this.table} WHERE age BETWEEN ${min} AND ${max}`;
    return executeStatement({ Statement });
  }

  async save(employee: EmployeeEntity) {
    await docClient
      .put({
        TableName: this.table,
        Item: { ...employee },
      })
      .promise();

    return employee;
  }

  async delete(id: string) {
    await docClient
      .delete({
        TableName: this.table,
        Key: { id },
      })
      .promise();
  }

  async deleteAll(ids: string[]) {
    await Promise.all(
      ids.map((id) =>
        executeStatement({
          Statement: `DELETE FROM ${this.table} WHERE id = '${id}'`,
        })
      )
    );
  }

  async saveAll(employees: EmployeeEntity[]) {
    await Promise.all(
      chunk(employees, this.batchWriteLimit).map((batch) =>
        this.saveBatch(batch)
      )
    );
    return employees;
  }

  async create() {
    await dynamo
      .createTable({
        TableName: this.table,
        AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
        KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
        ProvisionedThroughput: {
          ReadCapacityUnits: 10,
          WriteCapacityUnits: 10,
        },
      })
      .promise();
  }

  async deleteTable() {
    await dynamo.deleteTable({ TableName: this.table }).promise();
  }

  async saveBatch(employees: EmployeeEntity[]) {
    if (employees.length > this.batchWriteLimit)
      throw new Error(
        `Failed to save, batch has more than ${this.batchWriteLimit} items`
      );

    await docClient
      .batchWrite({
        RequestItems: {
          [this.table]: employees.map((entity) => ({
            PutRequest: { Item: entity },
          })),
        },
      })
      .promise();

    return employees;
  }
}

export const employeeRepo = new PartiqlEmployeeRepo();
