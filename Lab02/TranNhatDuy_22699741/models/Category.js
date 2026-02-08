import { v4 as uuidv4 } from "uuid";

export default class Categories {
    constructor({ categoryId, name, description }) {
        ((this.categoryId = categoryId || uuidv4()),
            (this.name = name),
            (this.description = description));
    }
}