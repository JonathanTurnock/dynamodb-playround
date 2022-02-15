import { config, DynamoDB } from "aws-sdk";

config.update({
  region: "eu-west-2",
  accessKeyId: "anything",
  secretAccessKey: "anything",
  endpoint: "http://localhost:4566",
} as any);

export const dynamo = new DynamoDB({ apiVersion: "2012-08-10" });
export const docClient = new DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
});
