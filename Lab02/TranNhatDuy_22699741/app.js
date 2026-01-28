const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const productRoutes = require("./routes/product.routes");
app.use("/", productRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
