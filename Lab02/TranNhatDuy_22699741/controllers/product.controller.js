import docClient from "../config/dynamodb.js";
import Product from "../models/Product.js";
import s3 from "../config/s3.js";
import {
    ScanCommand,
    PutCommand,
    GetCommand,
    UpdateCommand,
    DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { PutObjectCommand } from "@aws-sdk/client-s3";

import { createProductLog } from "./productLog.controller.js";

const TABLE_NAME = "Products";
const BUCKET_NAME = "duythvo-cnm-products";

export const getAllProducts = async (req, res) => {
    const {
        search = "",
        categoryId = "",
        minPrice = "",
        maxPrice = "",
        page = 1,
    } = req.query;

    const limit = 5;
    const currentPage = Number(page);

    const productData = await docClient.send(
        new ScanCommand({ TableName: TABLE_NAME }),
    );

    let products = productData.Items || [];

    if (search) {
        products = products.filter((p) =>
            p.name.toLowerCase().includes(search.toLowerCase()),
        );
    }

    if (categoryId) {
        products = products.filter((p) => p.categoryId === categoryId);
    }

    if (minPrice) {
        products = products.filter((p) => Number(p.price) >= Number(minPrice));
    }

    if (maxPrice) {
        products = products.filter((p) => Number(p.price) <= Number(maxPrice));
    }

    const totalCount = products.length;

    const inStockCount = products.filter((p) => p.quantity >= 5).length;
    const lowStockCount = products.filter(
        (p) => p.quantity > 0 && p.quantity < 5,
    ).length;
    const outStockCount = products.filter((p) => p.quantity === 0).length;

    const totalPages = Math.ceil(products.length / limit);
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedProducts = products.slice(startIndex, endIndex);

    const categoriesData = await docClient.send(
        new ScanCommand({ TableName: "Categories" }),
    );

    res.render("products", {
        products: paginatedProducts,
        categories: categoriesData.Items,

        currentPage,
        totalPages,

        query: {
            search,
            categoryId,
            minPrice,
            maxPrice,
        },
        totalCount,
        inStockCount,
        lowStockCount,
        outStockCount,
        user: req.session.user,
    });
};

export const createProduct = async (req, res) => {
    let imageUrl = "";

    if (req.file) {
        const fileName = `products/${Date.now()}-${req.file.originalname}`;

        await s3.send(
            new PutObjectCommand({
                Bucket: BUCKET_NAME,
                Key: fileName,
                Body: req.file.buffer,
                ContentType: req.file.mimetype,
            }),
        );

        imageUrl = `https://${BUCKET_NAME}.s3.eu-north-1.amazonaws.com/${fileName}`;
    }

    const product = new Product({
        ...req.body,
        url_image: imageUrl,
    });

    await docClient.send(
        new PutCommand({
            TableName: TABLE_NAME,
            Item: product,
        }),
    );

    await createProductLog({
        productId: product.id,
        action: "CREATE",
        userId: req.session.user.userId,
    });

    res.redirect("/products");
};

export const getProductById = async (req, res) => {
    const data = await docClient.send(
        new GetCommand({
            TableName: TABLE_NAME,
            Key: { id: req.params.id },
        }),
    );
    const categoriesData = await docClient.send(
        new ScanCommand({ TableName: "Categories" }),
    );

    res.render("editProduct", {
        product: data.Item,
        categories: categoriesData.Items,
    });
};

export const updateProduct = async (req, res) => {
    let imageUrl = req.body.old_image;

    if (req.file) {
        const fileName = `products/${Date.now()}-${req.file.originalname}`;

        await s3.send(
            new PutObjectCommand({
                Bucket: BUCKET_NAME,
                Key: fileName,
                Body: req.file.buffer,
                ContentType: req.file.mimetype,
            }),
        );

        imageUrl = `https://${BUCKET_NAME}.s3.eu-north-1.amazonaws.com/${fileName}`;
    }

    await docClient.send(
        new UpdateCommand({
            TableName: TABLE_NAME,
            Key: { id: req.params.id },
            UpdateExpression:
                "SET #name = :name, price = :price, quantity = :quantity, url_image = :url_image, categoryId = :categoryId, isDeleted = :isDeleted",
            ExpressionAttributeNames: {
                "#name": "name",
            },
            ExpressionAttributeValues: {
                ":name": req.body.name,
                ":price": Number(req.body.price),
                ":quantity": Number(req.body.quantity),
                ":url_image": imageUrl,
                ":categoryId": req.body.categoryId,
                ":isDeleted": req.body.isDeleted === "true",
            },
        }),
    );

    await createProductLog({
        productId: req.params.id,
        action: "UPDATE",
        userId: req.session.user.userId,
    });

    res.redirect("/products");
};

export const deleteProduct = async (req, res) => {
    await docClient.send(
        new DeleteCommand({
            TableName: TABLE_NAME,
            Key: { id: req.params.id },
        }),
    );

    await createProductLog({
        productId: req.params.id,
        action: "DELETE",
        userId: req.session.user.userId,
    });

    res.redirect("/products");
};