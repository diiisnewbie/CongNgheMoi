const ddb = require("../config/dynamodb");
const {
    PutCommand,
    ScanCommand,
    GetCommand,
    UpdateCommand
} = require("@aws-sdk/lib-dynamodb");

const TABLE_NAME = "Products";

module.exports = {
    async create(product) {
        return ddb.send(
            new PutCommand({
                TableName: TABLE_NAME,
                Item: product
            })
        );
    },

    async findAll(filters = {}) {
        let filterExp = [];
        let attrValues = { ":f": false };
        let attrNames = {};

        // soft delete
        filterExp.push("attribute_not_exists(isDeleted) OR isDeleted = :f");

        // 🔍 tìm theo tên (contains)
        if (filters.keyword) {
            filterExp.push("contains(#n, :kw)");
            attrValues[":kw"] = filters.keyword;
            attrNames["#n"] = "name";
        }

        // 🗂 lọc theo category
        if (filters.categoryId) {
            filterExp.push("categoryId = :cid");
            attrValues[":cid"] = filters.categoryId;
        }

        // 💰 lọc theo khoảng giá
        if (filters.minPrice) {
            filterExp.push("price >= :min");
            attrValues[":min"] = Number(filters.minPrice);
        }

        if (filters.maxPrice) {
            filterExp.push("price <= :max");
            attrValues[":max"] = Number(filters.maxPrice);
        }

        const params = {
            TableName: "Products",
            FilterExpression: filterExp.join(" AND "),
            ExpressionAttributeValues: attrValues
        };

        // ⚠️ chỉ add khi dùng
        if (Object.keys(attrNames).length > 0) {
            params.ExpressionAttributeNames = attrNames;
        }

        const result = await ddb.send(new ScanCommand(params));
        return result.Items || [];
    }

    ,

    async findById(id) {
        const result = await ddb.send(
            new GetCommand({
                TableName: TABLE_NAME,
                Key: { id }
            })
        );
        return result.Item;
    },



    async softDelete(id) {
        return ddb.send(
            new UpdateCommand({
                TableName: TABLE_NAME,
                Key: { id },
                UpdateExpression: "SET isDeleted = :true",
                ExpressionAttributeValues: {
                    ":true": true
                }
            })
        );
    },

    async update(product) {
        return ddb.send(
            new PutCommand({
                TableName: "Products",
                Item: product
            })
        );
    }

};
