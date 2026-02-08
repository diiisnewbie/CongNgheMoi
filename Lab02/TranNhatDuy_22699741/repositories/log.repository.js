const ddb = require("../config/dynamodb");
const { PutCommand } = require("@aws-sdk/lib-dynamodb");

module.exports = {
    create: log => ddb.send(new PutCommand({
        TableName: "ProductLogs",
        Item: log
    }))
};

