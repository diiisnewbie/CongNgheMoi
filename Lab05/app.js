import express from "express";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoute.js";

dotenv.config();

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/products", productRoutes);

app.listen(process.env.PORT || 3000, () => {
    console.log("Server running");
});