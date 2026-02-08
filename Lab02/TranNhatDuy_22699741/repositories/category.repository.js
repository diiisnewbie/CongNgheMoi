const { ScanCommand, PutCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const ddb = require("../config/dynamodb");
module.exports = {
    findAll: () => ddb.send(new ScanCommand({ TableName: "Categories" }))
        .then(r => r.Items || []),

    create: item => ddb.send(new PutCommand({
        TableName: "Categories",
        Item: item
    })),

    update: item => ddb.send(new PutCommand({
        TableName: "Categories",
        Item: item
    }))
};
