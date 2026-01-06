import express from "express"
import routerLogin from "./routes/task_routes.mjs"
import 'dotenv/config';
//import { log } from "./middleware/loggin.mjs";

const PORT = 60000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
//app.use(log);
//USAR EL IMPORT CREADO
app.use(routerLogin); //TODAS LAS RUTAS DE DATOS TIENEN DELANTE /api (TE OBLIGA-RESTRICCION) 

app.listen(PORT, ()=>console.log("INICIAMOS", PORT))

//PARA EL CLIENTE
/*app.set("view engine", "ejs")
app.set("views", path.join(path.resolve("."), "uso_vistas", "views"))*/
