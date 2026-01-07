/*import {Pool} from "pg"

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
    host: process.env.DB_HOST,
    max: 20 

    //PODEMOS INCLUIR MAS INFORMACION
})

export default pool*/
/*import 'dotenv/config';
import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  ssl: { rejectUnauthorized: false } // necesario para Supabase
});

export default pool;*/
import dotenv from 'dotenv';
import path from 'path';
import pkg from 'pg';
const { Pool } = pkg;

dotenv.config({ path: path.resolve('./configuration/.env') });

console.log("DATABASE_URL:", process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_NAME, process.env.DB_PORT, process.env.DB_HOST);

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
    host: process.env.DB_HOST,
    max: 20 

    //PODEMOS INCLUIR MAS INFORMACION
})

export default pool;