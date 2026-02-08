const { v4: uuid } = require("uuid");
const productRepo = require("../repositories/product.repository");
const logRepo = require("../repositories/log.repository");

module.exports = {
    // ======================
    // CREATE PRODUCT
    // ======================
    async create(data, user) {
        const product = {
            id: uuid(),
            name: data.name,
            price: Number(data.price),
            quantity: Number(data.quantity),
            categoryId: data.categoryId,
            isDeleted: false,
            createdAt: new Date().toISOString()
        };

        await productRepo.create(product);

        await logRepo.create({
            logId: uuid(),
            productId: product.id,
            action: "CREATE",
            userId: user.userId,
            time: new Date().toISOString()
        });

        return product;
    },

    // ======================
    // LIST PRODUCTS
    // ======================
    async list(query) {
        const page = Number(query.page) || 1;
        const pageSize = 5;

        const items = await productRepo.findAll(query);

        const total = items.length;
        const totalPages = Math.ceil(total / pageSize);

        const start = (page - 1) * pageSize;
        const pagedItems = items.slice(start, start + pageSize);

        return {
            products: pagedItems,
            page,
            totalPages
        };
    },

    // ======================
    // UPDATE PRODUCT
    // ======================
    async update(id, data, user) {
        const updatedProduct = {
            id, // bắt buộc để PutCommand ghi đè
            name: data.name,
            price: Number(data.price),
            quantity: Number(data.quantity),
            categoryId: data.categoryId,
            isDeleted: false, // giữ lại sản phẩm
            updatedAt: new Date().toISOString()
        };

        await productRepo.update(updatedProduct);

        await logRepo.create({
            logId: uuid(),
            productId: id,
            action: "UPDATE",
            userId: user.userId,
            time: new Date().toISOString()
        });

        return updatedProduct;
    },

    // ======================
    // SOFT DELETE PRODUCT
    // ======================
    async remove(id, user) {
        await productRepo.softDelete(id);

        await logRepo.create({
            logId: uuid(),
            productId: id,
            action: "DELETE",
            userId: user.userId,
            time: new Date().toISOString()
        });
    }
};
