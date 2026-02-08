const { ScanCommand, PutCommand } = require("@aws-sdk/lib-dynamodb");
const ddb = require("../config/dynamodb");
module.exports = {
    async findByUsername(username) {
        const result = await ddb.send(
            new ScanCommand({
                TableName: "Users",
                FilterExpression: "username = :u",
                ExpressionAttributeValues: {
                    ":u": username
                }
            })
        );
        return result.Items[0]; // lấy user đầu tiên
    },

    create(user) {
        return ddb.send(
            new PutCommand({
                TableName: "Users",
                Item: user
            })
        );
    }
};
