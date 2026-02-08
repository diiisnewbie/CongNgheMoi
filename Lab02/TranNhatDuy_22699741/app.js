import express from "express";
import productRouter from "./routes/product.routes.js";
import session from "express-session";
import authRouter from "./routes/auth.route.js";
import categoryRouter from "./routes/category.route.js";
import productLogsRouter from "./routes/productLog.route.js";

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
      secret: "your_secret_key",
      resave: false,
      saveUninitialized: false,
    }),
);

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

app.use("/", authRouter);
app.use("/productLogs", productLogsRouter);
app.use("/products", productRouter);
app.use("/categories", categoryRouter);

app.listen(3000, "0.0.0.0", () => {
  console.log("Server running on port 3000");
});