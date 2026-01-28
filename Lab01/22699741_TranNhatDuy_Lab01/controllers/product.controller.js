const Product = require("../models/product.model");

async function list(req, res) {
    const products = await Product.findAll();
    console.log(products);
    res.render("products/list", { products });
}

function addForm(req, res) {
    res.render("products/add");
}

async function add(req, res) {
    await Product.create(req.body);
    res.redirect("/products");
}

async function editForm(req, res) {
    const product = await Product.findById(req.params.id);
    res.render("products/edit", { product });
}

async function edit(req, res) {
    await Product.update(req.params.id, req.body);
    res.redirect("/products");
}

async function remove(req, res) {
    await Product.delete(req.params.id);
    res.redirect("/products");
}

module.exports = {
    list,
    addForm,
    add,
    editForm,
    edit,
    remove
};
