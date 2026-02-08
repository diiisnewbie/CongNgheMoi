const bcrypt = require("bcryptjs");
const userRepo = require("../repositories/user.repository");

module.exports = {
    async login(username, password) {
        const user = await userRepo.findByUsername(username);
        if (!user) throw new Error("User not found");

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) throw new Error("Wrong password");

        return user;

    }
};
