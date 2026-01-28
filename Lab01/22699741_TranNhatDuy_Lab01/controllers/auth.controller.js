const bcrypt = require("bcrypt");
const { findByUsername } = require("../models/user.model");

function showLogin(req, res) {
    res.render("login");
}

async function login(req, res) {
    const { username, password } = req.body;
    const user = await findByUsername(username);

    if (!user) return res.send("Sai tài khoản");

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.send("Sai mật khẩu");

    req.session.user = user;
    res.redirect("/products");
}

function logout(req, res) {
    req.session.destroy(() => {
        res.redirect("/login");
    });
}

module.exports = { showLogin, login, logout };
