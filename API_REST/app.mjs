import dotenv from 'dotenv';
import path from 'path';
import express from "express"
import session from "express-session";
import cors from "cors";
import routerLogin from "./routes/task_routes.mjs"
import {createTables} from "./configuration/database.mjs"

const PORT = 60000;
const app = express();

dotenv.config({ path: path.resolve('./configuration/.env') });

console.log("DATABASE_URL:", process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_NAME, process.env.DB_PORT, process.env.DB_HOST);

app.use(cors({
    origin: "http://localhost:60001",
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(session({
    secret: "Cadena secreta",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 30 } // 30 min
}));
app.use(routerLogin); 

async function loadTables(){
    try{

    await createTables()

    }catch(err){
    console.error("Error al iniciar el servidor:", err);
    process.exit(1);
    }
}

loadTables()

app.listen(PORT, ()=>console.log("INICIAMOS", PORT))



