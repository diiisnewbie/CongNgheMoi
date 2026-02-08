const { v4: uuid } = require("uuid");
const logRepo = require("../repositories/log.repository");
exports.log = (productId, action, userId) =>
    logRepo.create({
        logId: uuid(),
        productId,
        action,
        userId,
        time: new Date().toISOString()
    });
