const { v4: uuid } = require("uuid");
const categoryRepo = require("../repositories/category.repository");

module.exports = {
    async create(name, description) {
        return categoryRepo.create({
            categoryId: uuid(),
            name,
            description
        });
    },

    async list() {
        const result = await categoryRepo.findAll();
        return result.Items;
    }
};
