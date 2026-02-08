import express from "express";
import upload from "../middlewares/upload.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import {
    getAllCategories,
    createCategory,
    getCategoryById,
    updateCategory,
    deleteCategory,
} from "../controllers/category.controller.js";

const router = express.Router();

router.get("/", isAuthenticated, getAllCategories);
router.post("/add", isAuthenticated, authorizeRoles("admin"), createCategory);
router.get("/edit/:id", getCategoryById);
router.post(
    "/edit/:id",
    isAuthenticated,
    authorizeRoles("admin"),
    updateCategory,
);
router.get(
    "/delete/:id",
    isAuthenticated,
    authorizeRoles("admin"),
    deleteCategory,
);

export default router;