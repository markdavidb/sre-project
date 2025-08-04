import mysql from 'mysql2/promise';
import fs    from 'fs';
import dotenv from 'dotenv';
dotenv.config();

export const db = mysql.createPool({
    host : process.env.DB_HOST,
    port : Number(process.env.DB_PORT),
    user : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    ssl: {
        ca: fs.readFileSync(process.env.CA_PATH)
    }
});
