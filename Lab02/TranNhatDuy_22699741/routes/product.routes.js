import express from "express";
import upload from "../middlewares/upload.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import {
    getAllProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct,
} from "../controllers/product.controller.js";

const router = express.Router();

router.get("/", isAuthenticated, getAllProducts);
router.post(
    "/add",
    isAuthenticated,
    authorizeRoles("admin"),
    upload.single("image"),
    createProduct,
);
router.get("/edit/:id", getProductById);
router.post(
    "/edit/:id",
    isAuthenticated,
    authorizeRoles("admin"),
    upload.single("image"),
    updateProduct,
);
router.get(
    "/delete/:id",
    isAuthenticated,
    authorizeRoles("admin"),
    deleteProduct,
);

export default router;