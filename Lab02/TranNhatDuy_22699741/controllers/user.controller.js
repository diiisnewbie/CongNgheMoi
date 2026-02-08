import docClient from "../config/dynamodb.js";
import User from "../models/User.js";
import validator from "validator";
import bcrypt from "bcrypt";

import {
    ScanCommand,
    PutCommand,
    GetCommand,
    UpdateCommand,
    DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { PutObjectCommand } from "@aws-sdk/client-s3";

const TABLE_NAME = "Users";

export const getAllUsers = async (req, res) => {
    // lay data tu dynamodb nhung khong hien thi mat khau
    const data = await docClient.send(new ScanCommand({ TableName: TABLE_NAME }));
    const users = data.Items.map(({ password, ...rest }) => rest);
    res.render("users", { users });
};

export const createUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!validator.isEmail(email)) {
        return res.status(400).send("Invalid email format");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        name,
        email,
        password: hashedPassword,
    });
    await docClient.send(
        new PutCommand({
            TableName: TABLE_NAME,
            Item: user,
        }),
    );
    res.redirect("/users");
};

export const getUserById = async (req, res) => {
    const data = await docClient.send(
        new GetCommand({
            TableName: TABLE_NAME,
            Key: { id: req.params.id },
        }),
    );
    res.render("editUser", { user: data.Item });
};

export const updateUser = async (req, res) => {
    const { name, password } = req.body;
    let updateExpression = "SET #name = :name";
    let expressionAttributeValues = {
        ":name": name,
    };

    if (password && password.trim() !== "") {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateExpression += ", password = :password";
        expressionAttributeValues[":password"] = hashedPassword;
    }

    await docClient.send(
        new UpdateCommand({
            TableName: TABLE_NAME,
            Key: { id: req.params.id },
            UpdateExpression: updateExpression,
            ExpressionAttributeValues: expressionAttributeValues,
        }),
    );
    res.redirect("/users");
};

export const deleteUser = async (req, res) => {
    await docClient.send(
        new DeleteCommand({
            TableName: TABLE_NAME,
            Key: { id: req.params.id },
        }),
    );
    res.redirect("/users");
};

export const getUserByUsername = async (username) => {
    const data = await docClient.send(new ScanCommand({ TableName: TABLE_NAME }));
    return data.Items.find((user) => user.username === username);
};