import {Pool} from "pg"

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    max: 20 

    //PODEMOS INCLUIR MAS INFORMACION
})

export default pool