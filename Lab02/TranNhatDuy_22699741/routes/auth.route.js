import express from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

import { showLogin, login, logout } from "../controllers/auth.controller.js";

const router = express.Router();
router.get("/login", showLogin);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);
export default router;