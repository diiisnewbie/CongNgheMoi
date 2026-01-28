const { v4: uuidv4 } = require("uuid");
const {
    ddb,
    ScanCommand,
    PutCommand,
    GetCommand,
    UpdateCommand,
    DeleteCommand,
} = require("../service/dynamodb");
const { s3, PutObjectCommand, DeleteObjectCommand } = require("../service/s3");
const fs = require("fs");

const TABLE = "Products";
const BUCKET = process.env.S3_BUCKET;

// READ
exports.getAll = async (req, res) => {
    const data = await ddb.send(new ScanCommand({ TableName: TABLE }));
    res.render("index", { products: data.Items });
};

// CREATE FORM
exports.showAdd = (req, res) => res.render("add");

// CREATE
exports.create = async (req, res) => {
    const id = uuidv4();
    const file = req.file;

    const s3Key = `${id}-${file.originalname}`;

    await s3.send(
        new PutObjectCommand({
            Bucket: BUCKET,
            Key: s3Key,
            Body: fs.createReadStream(file.path),
            ContentType: file.mimetype,
        })
    );

    const imageUrl = `https://${BUCKET}.s3.amazonaws.com/${s3Key}`;

    await ddb.send(
        new PutCommand({
            TableName: TABLE,
            Item: {
                id,
                name: req.body.name,
                price: Number(req.body.price),
                quantity: Number(req.body.quantity),
                url_image: imageUrl,
                s3Key,
            },
        })
    );

    res.redirect("/");
};

// EDIT FORM
exports.showEdit = async (req, res) => {
    const data = await ddb.send(
        new GetCommand({
            TableName: TABLE,
            Key: { id: req.params.id },
        })
    );
    res.render("edit", { product: data.Item });
};

// UPDATE
exports.update = async (req, res) => {
    await ddb.send(
        new UpdateCommand({
            TableName: TABLE,
            Key: { id: req.params.id },
            UpdateExpression: "set #n=:n, price=:p, quantity=:q",
            ExpressionAttributeNames: { "#n": "name" },
            ExpressionAttributeValues: {
                ":n": req.body.name,
                ":p": Number(req.body.price),
                ":q": Number(req.body.quantity),
            },
        })
    );
    res.redirect("/");
};

// DELETE
exports.delete = async (req, res) => {
    await ddb.send(
        new DeleteCommand({
            TableName: TABLE,
            Key: { id: req.params.id },
        })
    );
    res.redirect("/");
};
