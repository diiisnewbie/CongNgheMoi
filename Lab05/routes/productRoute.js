import express from "express";
import {
    index,
    add,
    showEdit,
    edit,
    remove,
} from "../controllers/productController.js";

import upload from "../middlewares/upload.js";

const router = express.Router();

router.get("/", index);

router.post("/add", upload.single("image"), add);

router.get("/edit/:id", showEdit);
router.post("/edit/:id", upload.single("image"), edit);

router.get("/delete/:id", remove);

export default router;