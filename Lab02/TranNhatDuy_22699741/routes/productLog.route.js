import express from "express";
import upload from "../middlewares/upload.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { getAllProductLogs } from "../controllers/productLog.controller.js";

const router = express.Router();

router.get("/", isAuthenticated, authorizeRoles("admin"), getAllProductLogs);

export default router;