# AWS Dynamo DB Playground

Simple AWS DynamoDB playground showing how to perform CRUD operations using the AWS SDK

## Usage

Start the localstack which provides a local Dynamo DB to test against

Run the scripts as necessary to test various operations

Start with the following to create and populate the table

```shell
ts-node ./scripts/c/createTable.ts
ts-node ./scripts/c/populateTable.ts
```

Take a look at the `./src/employee.repo.ts` to see all integration code with AWS SDK