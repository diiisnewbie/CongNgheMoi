import { v4 as uuidv4 } from "uuid";

export default class ProductLogs {
    constructor({ logId, productId, action, userId, time }) {
        ((this.logId = logId || uuidv4()),
            (this.productId = productId),
            (this.action = action),
            (this.userId = userId),
            (this.time = time));
    }
}