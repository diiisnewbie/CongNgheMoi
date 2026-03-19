const Product = require("../models/Product");
const fs = require("fs");
const path = require("path");

// Helper: Delete image file
function deleteImageFile(imageUrl) {
  if (!imageUrl) return;
  const filename = path.basename(imageUrl);
  const filepath = path.join(__dirname, "../uploads", filename);
  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath);
  }
}

// GET / - List all products
exports.index = async (req, res) => {
  try {
    const search = req.query.search || "";
    const products = await Product.getAll(search);
    res.render("products/index", {
      products,
      search,
      title: "Danh Sách Sản Phẩm",
    });
  } catch (err) {
    console.error(err);
    req.flash("error", "Không thể tải danh sách sản phẩm: " + err.message);
    res.render("products/index", {
      products: [],
      search: "",
      title: "Danh Sách Sản Phẩm",
    });
  }
};

// GET /products/new - Show add form
exports.newForm = (req, res) => {
  res.render("products/new", {
    title: "Thêm Sản Phẩm",
    product: {},
    errors: [],
  });
};

// POST /products - Create product
exports.create = async (req, res) => {
  const errors = Product.validate(req.body);

  if (errors.length > 0) {
    // Delete uploaded file if validation fails
    if (req.file) deleteImageFile("/uploads/" + req.file.filename);
    return res.render("products/new", {
      title: "Thêm Sản Phẩm",
      product: req.body,
      errors,
    });
  }

  try {
    const data = { ...req.body };
    if (req.file) {
      data.url_image = "/uploads/" + req.file.filename;
    }

    await Product.create(data);
    req.flash("success", `✅ Sản phẩm "${req.body.name}" đã được thêm thành công!`);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    if (req.file) deleteImageFile("/uploads/" + req.file.filename);
    res.render("products/new", {
      title: "Thêm Sản Phẩm",
      product: req.body,
      errors: ["Lỗi hệ thống: " + err.message],
    });
  }
};

// GET /products/:id - Show detail
exports.show = async (req, res) => {
  try {
    const product = await Product.getById(req.params.id);
    if (!product) {
      req.flash("error", "Không tìm thấy sản phẩm.");
      return res.redirect("/");
    }
    res.render("products/show", { product, title: product.name });
  } catch (err) {
    console.error(err);
    req.flash("error", "Lỗi: " + err.message);
    res.redirect("/");
  }
};

// GET /products/:id/edit - Show edit form
exports.editForm = async (req, res) => {
  try {
    const product = await Product.getById(req.params.id);
    if (!product) {
      req.flash("error", "Không tìm thấy sản phẩm.");
      return res.redirect("/");
    }
    res.render("products/edit", {
      product,
      title: "Sửa Sản Phẩm",
      errors: [],
    });
  } catch (err) {
    console.error(err);
    req.flash("error", "Lỗi: " + err.message);
    res.redirect("/");
  }
};

// PUT /products/:id - Update product
exports.update = async (req, res) => {
  const errors = Product.validate(req.body);

  if (errors.length > 0) {
    if (req.file) deleteImageFile("/uploads/" + req.file.filename);
    const product = await Product.getById(req.params.id).catch(() => req.body);
    return res.render("products/edit", {
      title: "Sửa Sản Phẩm",
      product: { ...product, ...req.body, id: req.params.id },
      errors,
    });
  }

  try {
    const existing = await Product.getById(req.params.id);
    if (!existing) {
      req.flash("error", "Không tìm thấy sản phẩm.");
      return res.redirect("/");
    }

    const data = { ...req.body };

    if (req.file) {
      // Delete old image
      if (existing.url_image) deleteImageFile(existing.url_image);
      data.url_image = "/uploads/" + req.file.filename;
    } else {
      data.url_image = existing.url_image;
    }

    await Product.update(req.params.id, data);
    req.flash("success", `✅ Sản phẩm "${req.body.name}" đã được cập nhật!`);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    if (req.file) deleteImageFile("/uploads/" + req.file.filename);
    res.render("products/edit", {
      title: "Sửa Sản Phẩm",
      product: { ...req.body, id: req.params.id },
      errors: ["Lỗi hệ thống: " + err.message],
    });
  }
};

// DELETE /products/:id - Delete product
exports.delete = async (req, res) => {
  try {
    const product = await Product.delete(req.params.id);
    // Delete image file
    if (product && product.url_image) deleteImageFile(product.url_image);
    req.flash("success", `🗑️ Đã xóa sản phẩm "${product ? product.name : ""}" thành công!`);
  } catch (err) {
    console.error(err);
    req.flash("error", "Lỗi khi xóa: " + err.message);
  }
  res.redirect("/");
};
