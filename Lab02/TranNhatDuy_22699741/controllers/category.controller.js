import docClient from "../config/dynamodb.js";
import Category from "../models/Category.js";
import s3 from "../config/s3.js";
import {
    ScanCommand,
    PutCommand,
    GetCommand,
    UpdateCommand,
    DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { PutObjectCommand } from "@aws-sdk/client-s3";

const TABLE_NAME = "Categories";
export const getAllCategories = async (req, res) => {
    const data = await docClient.send(new ScanCommand({ TableName: TABLE_NAME }));
    res.render("categories", { categories: data.Items });
};

export const createCategory = async (req, res) => {
    const category = new Category({
        ...req.body,
    });
    await docClient.send(
        new PutCommand({
            TableName: TABLE_NAME,
            Item: category,
        }),
    );
    res.redirect("/categories");
};

export const getCategoryById = async (req, res) => {
    const data = await docClient.send(
        new GetCommand({
            TableName: TABLE_NAME,
            Key: { categoryId: req.params.id },
        }),
    );
    res.render("editCategory", { category: data.Item });
};

export const updateCategory = async (req, res) => {
    await docClient.send(
        new UpdateCommand({
            TableName: TABLE_NAME,
            Key: { categoryId: req.params.id },
            UpdateExpression: "SET #name = :name, #description = :description",
            ExpressionAttributeNames: {
                "#name": "name",
                "#description": "description",
            },
            ExpressionAttributeValues: {
                ":name": req.body.name,
                ":description": req.body.description,
            },
        }),
    );
    res.redirect("/categories");
};

export const deleteCategory = async (req, res) => {
    await docClient.send(
        new DeleteCommand({
            TableName: TABLE_NAME,
            Key: { categoryId: req.params.id },
        }),
    );
    res.redirect("/categories");
}