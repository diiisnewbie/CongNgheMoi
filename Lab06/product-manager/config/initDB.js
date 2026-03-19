const { client } = require("./dynamodb");
const {
  CreateTableCommand,
  ListTablesCommand,
} = require("@aws-sdk/client-dynamodb");

async function initDB() {
  try {
    // Check if table exists
    const listResult = await client.send(new ListTablesCommand({}));
    if (listResult.TableNames.includes("Products")) {
      console.log("✅ Bảng Products đã tồn tại.");
      return;
    }

    // Create table
    await client.send(
      new CreateTableCommand({
        TableName: "Products",
        KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
        AttributeDefinitions: [
          { AttributeName: "id", AttributeType: "S" },
        ],
        BillingMode: "PAY_PER_REQUEST",
      })
    );

    console.log("✅ Đã tạo bảng Products thành công!");
  } catch (err) {
    console.error("❌ Lỗi khởi tạo DB:", err.message);
    throw err;
  }
}

module.exports = { initDB };
