const express = require("express");
const session = require("express-session");
const path = require("path");

const authRoutes = require("./routes/auth.route");
const productRoutes = require("./routes/product.route");

const app = express();

app.set("view engine", "ejs");

// 🔥 DÒNG QUAN TRỌNG NHẤT
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));

app.use(
    session({
      secret: "shopdb",
      resave: false,
      saveUninitialized: false
    })
);

app.use("/", authRoutes);
app.use("/products", productRoutes);

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
