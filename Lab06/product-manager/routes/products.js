const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const productController = require("../controllers/productController");

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, "product-" + uniqueSuffix + ext);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) cb(null, true);
  else cb(new Error("Chỉ chấp nhận file ảnh (jpg, png, gif, webp)!"));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// Routes
router.get("/", productController.index);
router.get("/products/new", productController.newForm);
router.post("/products", upload.single("image"), productController.create);
router.get("/products/:id", productController.show);
router.get("/products/:id/edit", productController.editForm);
router.put("/products/:id", upload.single("image"), productController.update);
router.delete("/products/:id", productController.delete);

module.exports = router;
