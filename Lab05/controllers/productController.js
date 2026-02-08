import {
    createProduct,
    getAllProducts,
    getProductById,
    deleteProduct,
    updateProduct,
} from "../models/Product.js";

import s3 from "../config/s3.js";
import { v4 as uuidv4 } from "uuid";

// ================= LIST =================
export const index = async (req, res) => {
    const products = await getAllProducts();

    res.render("products", { products });
};

export const add = async (req, res) => {
    try {
        let imageUrl = "";

        if (req.file) {
            const params = {
                Bucket: process.env.S3_BUCKET,
                Key: `${uuidv4()}-${req.file.originalname}`,
                Body: req.file.buffer,
                ContentType: req.file.mimetype,
            };

            const uploadResult = await s3.upload(params).promise();

            imageUrl = uploadResult.Location;
        }

        await createProduct({
            name: req.body.name,
            price: req.body.price,
            quantity: req.body.quantity,
            url_image: imageUrl,
        });

        res.redirect("/products");
    } catch (err) {
        console.log(err);
        res.send(err);
    }
};

// ================= SHOW EDIT =================
export const showEdit = async (req, res) => {
    const product = await getProductById(req.params.id);

    res.render("editProduct", { product });
};

export const edit = async (req, res) => {
    try {
        let imageUrl = req.body.old_image;

        if (req.file) {
            const params = {
                Bucket: process.env.S3_BUCKET,
                Key: `${uuidv4()}-${req.file.originalname}`,
                Body: req.file.buffer,
                ContentType: req.file.mimetype,
            };

            const uploadResult = await s3.upload(params).promise();

            imageUrl = uploadResult.Location;
        }

        await updateProduct(req.params.id, {
            name: req.body.name,
            price: req.body.price,
            quantity: req.body.quantity,
            url_image: imageUrl,
        });

        res.redirect("/products");
    } catch (err) {
        res.send(err);
    }
};

// ================= DELETE =================
export const remove = async (req, res) => {
    await deleteProduct(req.params.id);

    res.redirect("/products");
};