const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({
  region: "local",
  endpoint: process.env.DYNAMODB_ENDPOINT || "http://localhost:8000",
  credentials: {
    accessKeyId: "local",
    secretAccessKey: "local",
  },
});

const docClient = DynamoDBDocumentClient.from(client);

module.exports = { client, docClient };
