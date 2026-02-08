import { v4 as uuidv4 } from "uuid";

export default class Users {
    constructor({ userId, username, password, role, createAt }) {
        ((this.userId = userId || uuidv4()),
            (this.username = username),
            (this.password = password),
            (this.role = role || "staff"),
            (this.createAt = createAt || new Date()));
    }
}