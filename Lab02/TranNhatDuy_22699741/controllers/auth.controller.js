import bcrypt from "bcrypt";
import { getUserByUsername } from "./user.controller.js";

export const showLogin = (req, res) => {
    res.render("login");
};

export const login = async (req, res) => {
    const { username, password } = req.body;
    const user = await getUserByUsername(username);

    if (!user) {
        return res.status(401).send("Invalid username or password.");
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        return res.status(401).send("Invalid username or password.");
    }
    req.session.user = {
        userId: user.userId,
        role: user.role,
        username: user.username,
    };
    res.redirect("/products");
};

export const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect("/products");
        }
        res.clearCookie("connect.sid");
        res.redirect("/login");
    });
};