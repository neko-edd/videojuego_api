import express from "express"
import session from "express-session"
import path from "path"
import routes from "../task_routes.mjs"

const PORT = 60000
const app = express()

//MIDDLEWARE
app.use(express.json()) //PERMITE EL USO DE JSON
app.use(express.urlencoded({extended: true})) //DECODIFICAMOS LO QUE ESTA EN EL CUERPO DE LAS PETICIONES
app.use(session({
    secret: "Cadena secreta", //CADENA QUE SE VA A CIFRAR EN LA SESION
    resave: false, //NO GUARDAR LA COOKIE DE NUEVO SI NO HAY CAMBIOS
    saveUninitialized: true, //QUE SE GUARDE LA SESION AUN SIN VALORES
    cookie: {maxAge: 1000 * 60 * 30} //30 MINUTOS
}))

app.set("view engine", "ejs")
app.set("views", path.join(path.resolve("."), "uso_vistas", "views"))

app.listen(PORT, () => {
    console.log("Escuchando en: ", PORT)
})

export default app