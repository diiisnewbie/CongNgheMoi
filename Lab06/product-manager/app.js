const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const { initDB } = require("./config/initDB");

const app = express();
const PORT = process.env.PORT || 3000;

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Session & Flash
app.use(
  session({
    secret: "product-manager-secret-2024",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 },
  })
);
app.use(flash());

// Pass flash to all views
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Routes
const productRoutes = require("./routes/products");
app.use("/", productRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).render("404", { title: "404 - Không tìm thấy trang" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("error", {
    title: "Lỗi hệ thống",
    message: err.message,
  });
});

// Start server
async function start() {
  try {
    await initDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
      console.log(`📦 DynamoDB Local: http://localhost:8000`);
      console.log(`🛠️  DynamoDB Admin UI: http://localhost:8001`);
    });
  } catch (err) {
    console.error("❌ Không thể kết nối DynamoDB. Hãy chắc chắn Docker đang chạy.");
    console.error("   Chạy lệnh: docker-compose up -d");
    process.exit(1);
  }
}

start();
