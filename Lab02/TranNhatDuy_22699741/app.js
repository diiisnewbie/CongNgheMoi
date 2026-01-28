require("dotenv").config();
const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

const productRoutes = require("./routes/product.routes");
app.use("/", productRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

const multer = require("multer");

const upload = multer({ dest: "uploads/" });

module.exports = upload;

