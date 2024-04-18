import sql from 'mssql'

import dotenv from 'dotenv'
dotenv.config()

const db_connection = {
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    server: process.env.SQL_SERVER,
    database: process.env.SQL_DATABASE,
    options: {
        encrypt: true, // for azure
        trustServerCertificate: true // change to true for local dev / self-signed certs
    }
}

export async function makeConnection(){ 
    try {
        const pool = await sql.connect(db_connection)
        return pool;
    } catch (error) {
        console.log(error);
    }
}  

export {sql}