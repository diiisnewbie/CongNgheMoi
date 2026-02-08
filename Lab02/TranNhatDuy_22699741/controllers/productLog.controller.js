import docClient from "../config/dynamodb.js";
import { v4 as uuidv4 } from "uuid";

import {
    ScanCommand,
    PutCommand,
    GetCommand,
    UpdateCommand,
    DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { PutObjectCommand } from "@aws-sdk/client-s3";

const TABLE_NAME = "ProductLogs";

export const getAllProductLogs = async (req, res) => {
    const data = await docClient.send(new ScanCommand({ TableName: TABLE_NAME }));
    res.render("productLogs", { productLogs: data.Items });
};

export const createProductLog = async ({ productId, action, userId, time }) => {
    if (!productId || !action || !userId) {
        throw new Error("Missing required fields for product log");
    }

    const logItem = {
        logId: uuidv4(),
        productId,
        action,
        userId,
        time: time || new Date().toISOString(),
    };

    await docClient.send(
        new PutCommand({
            TableName: TABLE_NAME,
            Item: logItem,
        }),
    );
};