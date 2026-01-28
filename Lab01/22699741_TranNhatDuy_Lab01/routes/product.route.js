const express = require("express");
const router = express.Router();

const {
    list,
    addForm,
    add,
    editForm,
    edit,
    remove
} = require("../controllers/product.controller");

const { auth } = require("../middlewares/auth.middleware");

// LIST
router.get("/", auth, list);

// ADD
router.get("/add", auth, addForm);
router.post("/add", auth, add);

// EDIT
router.get("/edit/:id", auth, editForm);
router.post("/edit/:id", auth, edit);

// DELETE
router.get("/delete/:id", auth, remove);

module.exports = router;
