import { v4 as uuidv4 } from "uuid";

export default class Product {
    constructor({
                    id,
                    name,
                    price,
                    quantity,
                    categoryId,
                    url_image,
                    isDeleted,
                    createAt,
                }) {
        ((this.id = id || uuidv4()),
            (this.name = name),
            (this.price = Number(price)),
            (this.quantity = Number(quantity)),
            (this.categoryId = categoryId),
            (this.url_image = url_image),
            (this.isDeleted = isDeleted || false),
            (this.createAt = createAt || new Date().toISOString()));
    }
}