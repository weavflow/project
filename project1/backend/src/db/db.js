import {createPool} from 'mysql2/promise'

export const pool = createPool({
    host: "localhost",
    user: "admin",
    password: "12345",
    database: "todo_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 5,
    timezone: "Z"
});