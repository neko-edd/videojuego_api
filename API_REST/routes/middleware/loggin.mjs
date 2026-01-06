import express from "express";
import session from "express-session";
//MIDDLEWARE
app.use(express.json()) //PERMITE EL USO DE JSON
app.use(express.urlencoded({extended: true})) //DECODIFICAMOS LO QUE ESTA EN EL CUERPO DE LAS PETICIONES
app.use(session({
    secret: "Cadena secreta", //CADENA QUE SE VA A CIFRAR EN LA SESION
    resave: false, //NO GUARDAR LA COOKIE DE NUEVO SI NO HAY CAMBIOS
    saveUninitialized: true, //QUE SE GUARDE LA SESION AUN SIN VALORES
    cookie: {maxAge: 1000 * 60 * 30} //30 MINUTOS
}))

function checkSession(req, res, next) {
    if (!req.session || !req.session.user) {
        return res.status(401).send("Sesión no iniciada");
    }
    next();
}

export default {
    checkSession
};