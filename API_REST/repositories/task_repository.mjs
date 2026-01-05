import pool from "../config/database.mjs"
import {User, Favourites, /*Sales,*/ Games} from "../models/task_models.mjs"

async function showCatalog(){
    const session = await pool.connect()
    let error = ""
    let games = []
    let result = null

    try{
        result = await session.query(`SELECT * FROM juegos`)
        if(!result){
            error.status(500).send("ERROR, HA HABIDO UN ERROR AL EXTRAER LOS DATOS DE LA BASE -- NO HAY JUEGOS")
        }else{
            error.sendStatus(200)
        }
    }catch(err){
        console.log("ERROR AL VER LOS JUEGOS", err.message)
    }finally{
        session.release()
    }
    if(result && result.rows){
        games = result.rows.map(row => new Games(row));
    }
    return games
}
async function showFavourites(user){
    const session = await pool.connect()
    let error = ""
    let favourites = []
    let result
    try{
        result = await session.query(`SELECT * FROM favoritos WHERE user_name = ${user}`)
        if(!result){
            error.status(500).send("ERROR, NO HAY DATOS DE FAVORITOS")
        }else{
            error.sendStatus(200)
        }
    }catch(err){
        console.log("ERROR AL VER FAVORITOS", err.message)
    }finally{
        session.release()
    }
    if(result && result.rows){
        favourites = result.rows.map(row => new Favourites(row));
    }
    return favourites
}
async function addOffer(user, game, price, percentage){
    const session = await pool.connect()
    let error = ""
    const activate = false
    let finalPrice = price
    let result = null
    try{
        if(percentage > 0){
            finalPrice = (price - (price*(percentage / 100)))
            const activate = true
        }    
        result = priceCart(user, game, finalPrice, activate)
        if(!result){
            error.status(500).send("ERROR EN EL REPOSITORIO", error)
        }else{
            error.sendStatus(200)
        }
    }catch(err){
        console.error("ERROR AL INSERTAR EN VENDIDOS", err.message)
    }finally{
        session.release()
    }
    return result
}
async function priceCart(user, game, price, activate){
    const session = await pool.connect()
    let error = ""
    let result
    try{
        result = await session.query(`INSERT INTO vendidos (user_name, name_game, price, offer) VALUES ('${user}', '${game}', '${price}', '${activate}')`)
        if(!result){
            error.status(500).send("ERROR EN EL REPOSITORIO", error)
        }else{
            error.sendStatus(200)
        }
    }catch(err){
        console.error("ERROR AL INSERTAR EN VENDIDOS", err.message)
    }finally{
        session.release()
    }
    return result
}
async function addFavourites(user, game, price){
    const session = await pool.connect()
    let error = ""
    let result
    try{
        result = await session.query(`INSERT INTO favoritos (user_name, name_game, price) VALUES ('${user}', '${game}', '${price}')`)
        if(!result){
            error.status(500).send("ERROR EN EL REPOSITORIO", error)
        }else{
            error.sendStatus(200)
        }
    }catch(err){
        console.error("ERROR AL INSERTAR EN FAVORITOS", err.message)
    }finally{
        session.release()
    }
    return result
}
async function createUser(user, passw){
    const session = await pool.connect()
    let error = ""
    let result
    try{
        result = await session.query(`INSERT INTO usuarios (user_name, password) VALUES ('${user}', '${passw}')`)
        if(!result){
            error.status(500).send("ERROR EN EL REPOSITORIO: ", error)
        }else{
            error.sendStatus(200)
        }
    }catch(err){
        console.error("ERROR AL CREAR USUARIO", err.message)
    }finally{
        session.release()
    }
    return result
}
async function startSession(user, passw){
    const session = await pool.connect()
    let userRow = undefined
    let result = []
    let error = ""
    try{
        result = await session.query(`SELECT * FROM usuarios WHERE user_name = ${user} AND password = ${passw}`)
        if(result.rows){
            task = new Task(result.rows[0])
        }else{
            error.status(500).send("ERROR: USUARIO O CONTRASEÑA MAL INTRODUCIDOS")
        }
    }catch(err){
        console.error("ERROR AL BUSCAR EL USUARIO", err.message)
    }finally{
        session.release()
    }
    if(result && result.rows){
        userRow = new User(result.rows[0])
    }
    return userRow
}

export default {
    startSession: startSession,
    createUser: createUser,
    addFavourites: addFavourites,
    priceCart: priceCart,
    showCatalog,
    showFavourites
    //addOffer: addOffer
}