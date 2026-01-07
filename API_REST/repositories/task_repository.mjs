import pool from "../configuration/database.mjs"
import {User, Favourites, /*Sales,*/ Games} from "../models/task_models.mjs"

async function addGame(name_game, price, image) { //FUNCIONA
    //const session = await pool.connect();

    try {
        const existing = await pool.query(
            `SELECT id FROM juegos WHERE name_game = '${name_game}'`
        );

        if (existing.rows.length === 0) {
            await session.query(`
                INSERT INTO juegos (name_game, price, image)
                VALUES ('${name_game}', ${price}, '${image}')
            `);

            console.log(`Juego insertado: ${name_game}`);
        } else {
            console.log(`Juego ya existe: ${name_game}`);
        }
    } catch (err) {
        console.error("Error al insertar juego:", err.message);
    }
}

async function showCatalog(){ //FUNCIONA
    //const session = await pool.connect()
    let games = []
    let result = null
    try{
        result = await pool.query(`SELECT * FROM juegos`)
        if(result && result.rows){
            games = result.rows.map(row => new Games(row))
        }
    }catch(err){
        console.error("ERROR AL VER LOS JUEGOS", err.message)
    }
    return games
}

async function showFavourites(userName) { //FUNCIONA
    let favourites = [];
    try {
        const userRes = await pool.query(
            `SELECT id FROM usuarios WHERE user_name = $1`,
            [userName]
        );

        if (!userRes.rows[0]) {
            console.error("Usuario no encontrado:", userName);
            return [];
        }

        const userId = userRes.rows[0].id; // UUID

        const result = await pool.query(
            `SELECT f.id AS fav_id, f.price, j.name_game, j.image
             FROM favoritos f
             LEFT JOIN juegos j ON f.game_id = j.id
             WHERE f.user_id = $1`,
            [userId]
        );

        console.log("Favoritos DB:", result.rows);

        if (result.rows) {
            favourites = result.rows.map(row => new Favourites(row));
        }

    } catch (err) {
        console.error("ERROR AL VER FAVORITOS", err.message);
        throw err;
    }

    return favourites;
}

async function priceCart(userName, gameName, price, activate){
    //const session = await pool.connect()
    let result
    try{
        // obtenemos los IDs de usuario y juego
        const userRes = await pool.query(`SELECT id FROM usuarios WHERE user_name='${userName}'`)
        const gameRes = await pool.query(`SELECT id FROM juegos WHERE name_game='${gameName}'`)
        const userId = userRes.rows[0].id
        const gameId = gameRes.rows[0].id

        result = await session.query(
            `INSERT INTO ventas (user_id, game_id, price, offer)
             VALUES ('${userId}', '${gameId}', ${price}, ${activate})
             RETURNING id`
        )
    }catch(err){
        console.error("ERROR AL INSERTAR EN VENTAS", err.message)
    }
    return result
}

async function addFavourites(userName, gameName, price){ //FUNCIONA
    //const session = await pool.connect()
    let result
    try{
        // obtenemos los IDs de usuario y juego
        const userRes = await pool.query(`SELECT id FROM usuarios WHERE user_name='${userName}'`)
        const gameRes = await pool.query(`SELECT id FROM juegos WHERE name_game='${gameName}'`)
        const userId = userRes.rows[0].id
        const gameId = gameRes.rows[0].id

        result = await pool.query(
            `INSERT INTO favoritos (user_id, game_id, price)
             VALUES ('${userId}', '${gameId}', ${price})
             RETURNING id`
        )
    }catch(err){
        console.error("ERROR AL INSERTAR EN FAVORITOS", err.message)
    }
    return result
}

async function createUser(user, passw){ //FUNCIONA
    //const session = await pool.connect();
    try {
        console.log("Intentando crear usuario en DB:", user, passw);

        const result = await pool.query(
            `INSERT INTO usuarios (user_name, password)
             VALUES ($1, $2)
             RETURNING id`,
            [user, passw]
        );

        console.log("Usuario creado con ID:", result.rows[0].id);
        return result.rows[0].id;
    } catch(err) {
        console.error("ERROR AL CREAR USUARIO (repository):", err);
        throw err; // Propaga el error al controller
    } 
}

async function startSession(user, passw){ //FUNCIONA
    //const session = await pool.connect()
    let userRow = undefined
    let result = []
    try{
        // buscamos el usuario con nombre y contraseña
        result = await pool.query(
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
    }

    return userRow
}
async function changePassword(userName, oldPassword, newPassword) {
    const session = await pool.connect();
    try {
        // Verificar que la contraseña actual sea correcta
        const userRes = await session.query(
            `SELECT * FROM usuarios 
             WHERE user_name='${userName}' AND password='${oldPassword}'`
        );

        if (!userRes.rows || userRes.rows.length === 0) {
            return { success: false, message: "Contraseña actual incorrecta" };
        }

        // Actualizar la contraseña
        await session.query(
            `UPDATE usuarios 
             SET password='${newPassword}' 
             WHERE user_name='${userName}'`
        );

        return { success: true, message: "Contraseña actualizada correctamente" };
    } catch (err) {
        console.error("ERROR AL CAMBIAR CONTRASEÑA", err.message);
        return { success: false, message: "Error al cambiar contraseña" };
    } finally {
        session.release();
    }
}

// Borrar usuario
async function deleteUser(userName, password) {
    const session = await pool.connect();
    try {
        // Verificar que la contraseña sea correcta
        const userRes = await session.query(
            `SELECT id FROM usuarios 
             WHERE user_name='${userName}' AND password='${password}'`
        );

        if (!userRes.rows || userRes.rows.length === 0) {
            return { success: false, message: "Contraseña incorrecta" };
        }

        const userId = userRes.rows[0].id;

        // Borrar registros relacionados (favoritos, ventas/carrito)
        await session.query(`DELETE FROM favoritos WHERE user_id='${userId}'`);
        await session.query(`DELETE FROM ventas WHERE user_id='${userId}'`);
        
        // Borrar usuario
        await session.query(`DELETE FROM usuarios WHERE id='${userId}'`);

        return { success: true, message: "Usuario eliminado correctamente" };
    } catch (err) {
        console.error("ERROR AL BORRAR USUARIO", err.message);
        return { success: false, message: "Error al borrar usuario" };
    } finally {
        session.release();
    }
}

export default {
    startSession: startSession,
    createUser: createUser,
    addFavourites: addFavourites,
    priceCart: priceCart,
    showCatalog,
    showFavourites,
    addGame,
    changePassword,
    deleteUser
    //addOffer: addOffer
}