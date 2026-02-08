import dynamodb from "../config/dynamodb.js";
import { v4 as uuidv4 } from "uuid";

const TABLE = "Products";


// CREATE
export const createProduct = async (data) => {

    const params = {
        TableName: TABLE,
        Item: {
            id: uuidv4(),
            name: data.name,
            price: Number(data.price),
            quantity: Number(data.quantity),
            url_image: data.url_image || ""
        }
    };

    return await dynamodb.put(params).promise();
};


// GET ALL
export const getAllProducts = async () => {

    const result = await dynamodb.scan({
        TableName: TABLE
    }).promise();

    return result.Items || [];
};


// GET BY ID
export const getProductById = async (id) => {

    const result = await dynamodb.get({
        TableName: TABLE,
        Key: { id }
    }).promise();

    return result.Item;
};


// DELETE
export const deleteProduct = async (id) => {

    return await dynamodb.delete({
        TableName: TABLE,
        Key: { id }
    }).promise();
};


// UPDATE
export const updateProduct = async (id, data) => {

    const params = {
        TableName: TABLE,
        Key: { id },

        UpdateExpression:
            "set #name=:name, price=:price, quantity=:quantity, url_image=:url",

        ExpressionAttributeNames: {
            "#name": "name"
        },

        ExpressionAttributeValues: {
            ":name": data.name,
            ":price": Number(data.price),
            ":quantity": Number(data.quantity),
            ":url": data.url_image
        }
    };

    return await dynamodb.update(params).promise();
};