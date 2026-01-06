import pool from "../config/database.mjs"
import {User, Favourites, /*Sales,*/ Games} from "../models/task_models.mjs"

async function addGame(name_game, price, description) {
    const session = await pool.connect();

    try {
        const existing = await session.query(
            `SELECT id FROM juegos WHERE name_game = '${name_game}'`
        );

        if (existing.rows.length === 0) {
            await session.query(`
                INSERT INTO juegos (name_game, price, description)
                VALUES ('${name_game}', ${price}, '${description}')
            `);

            console.log(`Juego insertado: ${name_game}`);
        } else {
            console.log(`Juego ya existe: ${name_game}`);
        }
    } catch (err) {
        console.error("Error al insertar juego:", err.message);
    } finally {
        session.release();
    }
}
/*async function showCatalog(){
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
}*/
async function showCatalog(){
    const session = await pool.connect()
    let games = []
    let result = null
    try{
        result = await session.query(`SELECT * FROM juegos`)
        if(result && result.rows){
            games = result.rows.map(row => new Games(row))
        }
    }catch(err){
        console.error("ERROR AL VER LOS JUEGOS", err.message)
    }finally{
        session.release()
    }
    return games
}
/*
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
}*/
async function showFavourites(userName){
    const session = await pool.connect()
    let favourites = []
    let result
    try{
        const userRes = await session.query(`SELECT id FROM usuarios WHERE user_name='${userName}'`)
        const userId = userRes.rows[0].id

        result = await session.query(
            `SELECT f.id AS fav_id, f.price, j.name_game, j.description
             FROM favoritos f
             JOIN juegos j ON f.game_id = j.id
             WHERE f.user_id='${userId}'`
        )

        if(result && result.rows){
            favourites = result.rows.map(row => new Favourites(row))
        }
    }catch(err){
        console.error("ERROR AL VER FAVORITOS", err.message)
    }finally{
        session.release()
    }
    return favourites
}
/*async function priceCart(user, game, price, activate){
    const session = await pool.connect()
    let error = ""
    let result
    try{
        result = await session.query(`INSERT INTO ventas (user_name, name_game, price, offer) VALUES ('${user}', '${game}', '${price}', '${activate}')`)
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
}*/
async function priceCart(userName, gameName, price, activate){
    const session = await pool.connect()
    let result
    try{
        // obtenemos los IDs de usuario y juego
        const userRes = await session.query(`SELECT id FROM usuarios WHERE user_name='${userName}'`)
        const gameRes = await session.query(`SELECT id FROM juegos WHERE name_game='${gameName}'`)
        const userId = userRes.rows[0].id
        const gameId = gameRes.rows[0].id

        result = await session.query(
            `INSERT INTO ventas (user_id, game_id, price, offer)
             VALUES ('${userId}', '${gameId}', ${price}, ${activate})
             RETURNING id`
        )
    }catch(err){
        console.error("ERROR AL INSERTAR EN VENTAS", err.message)
    }finally{
        session.release()
    }
    return result
}
/*async function addFavourites(user, game, price){
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
}*/
async function addFavourites(userName, gameName, price){
    const session = await pool.connect()
    let result
    try{
        // obtenemos los IDs de usuario y juego
        const userRes = await session.query(`SELECT id FROM usuarios WHERE user_name='${userName}'`)
        const gameRes = await session.query(`SELECT id FROM juegos WHERE name_game='${gameName}'`)
        const userId = userRes.rows[0].id
        const gameId = gameRes.rows[0].id

        result = await session.query(
            `INSERT INTO favoritos (user_id, game_id, price)
             VALUES ('${userId}', '${gameId}', ${price})
             RETURNING id`
        )
    }catch(err){
        console.error("ERROR AL INSERTAR EN FAVORITOS", err.message)
    }finally{
        session.release()
    }
    return result
}
/*async function createUser(user, passw){
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
}*/
async function createUser(user, passw){
    const session = await pool.connect()
    let result
    try{
        result = await session.query(
            `INSERT INTO usuarios (user_name, password)
             VALUES ('${user}', '${passw}')
             RETURNING id`
        )
        // extraemos el id del usuario creado
        const userId = result.rows[0].id
        return userId
    }catch(err){
        console.error("ERROR AL CREAR USUARIO", err.message)
    }finally{
        session.release()
    }
    return result
}
/*async function startSession(user, passw){
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
}*/
async function startSession(user, passw){
    const session = await pool.connect()
    let userRow = undefined
    let result = []
    try{
        // buscamos el usuario con nombre y contraseña
        result = await session.query(
            `SELECT * FROM usuarios 
             WHERE user_name='${user}' AND password='${passw}'`
        )

        // si hay filas, creamos el objeto User
        if(result && result.rows && result.rows.length > 0){
            userRow = new User(result.rows[0])
        }else{
            console.error("ERROR: USUARIO O CONTRASEÑA MAL INTRODUCIDOS")
        }

    }catch(err){
        console.error("ERROR AL BUSCAR EL USUARIO", err.message)
    }finally{
        session.release()
    }

    return userRow
}

export default {
    startSession: startSession,
    createUser: createUser,
    addFavourites: addFavourites,
    priceCart: priceCart,
    showCatalog,
    showFavourites,
    addGame
    //addOffer: addOffer
}