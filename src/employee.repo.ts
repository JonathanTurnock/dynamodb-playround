import { docClient, dynamo } from "../scripts/dynamo";
import { EmployeeEntity } from "./employee.entity";
import { chunk } from "lodash";

export class EmployeeRepo {
  private readonly table = "Employees";

  private readonly batchWriteLimit = 25;

  async findById(id: string) {
    const { Item } = await docClient
      .get({
        TableName: this.table,
        Key: { id },
      })
      .promise();
    return Item;
  }

  async findByIds(ids: string[]) {
    const { Responses } = await docClient
      .batchGet({
        RequestItems: {
          [this.table]: { Keys: ids.map((id) => ({ id })) },
        },
      })
      .promise();

    return (Responses as any)[this.table];
  }

  async findAll() {
    const { Items } = await docClient.scan({ TableName: this.table }).promise();
    return Items as EmployeeEntity[];
  }

  async findAllByAgeRange(min, max) {
    const { Items } = await docClient
      .scan({
        TableName: "Employees",
        FilterExpression: "age BETWEEN :1 AND :2",
        ExpressionAttributeValues: { ":1": min, ":2": max },
      })
      .promise();

    return Items;
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
      chunk(ids, this.batchWriteLimit).map((batch) => this.deleteBatch(batch))
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

  async deleteBatch(ids: string[]) {
    if (ids.length > this.batchWriteLimit)
      throw new Error(
        `Failed to delete, batch has more than ${this.batchWriteLimit} items`
      );

    await docClient
      .batchWrite({
        RequestItems: {
          [this.table]: ids.map((id) => ({ DeleteRequest: { Key: { id } } })),
        },
      })
      .promise();
  }
}

export const employeeRepo = new EmployeeRepo();
