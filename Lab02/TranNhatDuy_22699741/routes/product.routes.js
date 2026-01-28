const express = require("express");
const multer = require("multer");
const controller = require("../controller/product.controller");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get("/", controller.getAll);

router.get("/add", controller.showAdd);
router.post("/add", upload.single("image"), controller.create);

router.get("/edit/:id", controller.showEdit);
router.post("/edit/:id", controller.update);

router.get("/delete/:id", controller.delete);

module.exports = router;
