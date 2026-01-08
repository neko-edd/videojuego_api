import pool from "../configuration/database.mjs"
import {User, Favourites, Games} from "../models/task_models.mjs"

async function addGame(name_game, price, image) { //FUNCIONA
    const session = await pool.connect();

    try {
        const existing = await session.query(
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
    }finally{
        session.release();
    }
}

async function showCatalog(){ //FUNCIONA
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
        session.release();
    }
    return games
}

async function showFavourites(userName) { //FUNCIONA
    const session = await pool.connect()
    let favourites = [];
    try {
        const userRes = await session.query(
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
    }finally{
        session.release();
    }

    return favourites;
}
async function showCart(userName) {
    let carrito = [];
    try {
        const userRes = await pool.query(
            `SELECT id FROM usuarios WHERE user_name = $1`,
            [userName]
        );

        if (!userRes.rows[0]) {
            console.error("Usuario no encontrado:", userName);
            return [];
        }

        const userId = userRes.rows[0].id;

        const result = await pool.query(`
            SELECT v.id, v.price, v.offer, j.name_game, j.image
            FROM ventas v
            INNER JOIN juegos j ON v.game_id = j.id
            WHERE v.user_id = $1
            ORDER BY v.id DESC;`
            , [userId]);

        if (result.rows) {
            carrito = result.rows;
        }

    } catch (err) {
        console.error("ERROR AL VER CARRITO", err.message);
        throw err;
    }

    return carrito;
}

async function addPriceCart(userName, gameName, price, activate = false){
    let result
    try{
        const userRes = await pool.query(
            `SELECT id FROM usuarios WHERE user_name = $1`,
            [userName]
        );
        const gameRes = await pool.query(
            `SELECT id FROM juegos WHERE name_game = $1`,
            [gameName]
        );
        
        const userId = userRes.rows[0].id;
        const gameId = gameRes.rows[0].id;

        result = await pool.query(
            `INSERT INTO ventas (user_id, game_id, price, offer)
             VALUES ($1, $2, $3, $4)
             RETURNING id`,
            [userId, gameId, price, activate]
        );
    }catch(err){
        console.error("ERROR AL INSERTAR EN VENTAS", err.message)
        throw err;
    }
    return result
}

async function addFavourites(userName, gameName, price){ //FUNCIONA
    //const session = await pool.connect()
    let result
    try{
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
        throw err; 
    } 
}

async function startSession(user, passw){ //FUNCIONA
    //const session = await pool.connect()
    let userRow = undefined
    let result = []
    try{
        result = await pool.query(
            `SELECT * FROM usuarios 
             WHERE user_name='${user}' AND password='${passw}'`
        )

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
        const userRes = await session.query(
            `SELECT * FROM usuarios 
             WHERE user_name='${userName}' AND password='${oldPassword}'`
        );

        if (!userRes.rows || userRes.rows.length === 0) {
            return { success: false, message: "Contraseña actual incorrecta" };
        }

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
        const userRes = await session.query(
            `SELECT id FROM usuarios 
             WHERE user_name='${userName}' AND password='${password}'`
        );

        if (!userRes.rows || userRes.rows.length === 0) {
            return { success: false, message: "Contraseña incorrecta" };
        }

        const userId = userRes.rows[0].id;

        await session.query(`DELETE FROM favoritos WHERE user_id='${userId}'`);
        await session.query(`DELETE FROM ventas WHERE user_id='${userId}'`);
        
        await session.query(`DELETE FROM usuarios WHERE id='${userId}'`);

        return { success: true, message: "Usuario eliminado correctamente" };
    } catch (err) {
        console.error("ERROR AL BORRAR USUARIO", err.message);
        return { success: false, message: "Error al borrar usuario" };
    } finally {
        session.release();
    }
}
async function getMostSoldGames(limit = 10) {
    const session = await pool.connect();
    try {
        const result = await session.query(`
            SELECT 
                j.id,
                j.name_game,
                j.price,
                j.image,
                COUNT(v.id) as total_ventas,
                SUM(v.price) as ingresos_totales
            FROM juegos j
            LEFT JOIN ventas v ON j.id = v.game_id
            GROUP BY j.id, j.name_game, j.price, j.image
            HAVING COUNT(v.id) > 0
            ORDER BY total_ventas DESC
            LIMIT $1
        `, [limit]);

        return result.rows;
    } catch (err) {
        console.error("Error al obtener juegos más vendidos:", err.message);
        throw err;
    }finally{
        session.release();
    }
}
async function searchGames(searchTerm, minPrice, maxPrice, sortBy = 'name') {
    try {
        let query = `
            SELECT 
                j.*,
                COUNT(v.id) as num_ventas,
                COUNT(f.id) as num_favoritos
            FROM juegos j
            LEFT JOIN ventas v ON j.id = v.game_id
            LEFT JOIN favoritos f ON j.id = f.game_id
            WHERE 1=1
        `;
        
        const params = [];
        let paramIndex = 1;

        // Búsqueda por nombre
        if (searchTerm) {
            query += ` AND LOWER(j.name_game) LIKE LOWER($${paramIndex})`;
            params.push(`%${searchTerm}%`);
            paramIndex++;
        }

        // Filtro por precio mínimo
        if (minPrice !== undefined && minPrice !== null) {
            query += ` AND j.price >= $${paramIndex}`;
            params.push(minPrice);
            paramIndex++;
        }

        // Filtro por precio máximo
        if (maxPrice !== undefined && maxPrice !== null) {
            query += ` AND j.price <= $${paramIndex}`;
            params.push(maxPrice);
            paramIndex++;
        }

        query += ` GROUP BY j.id`;

        // Ordenamiento
        const sortOptions = {
            'name': 'j.name_game ASC',
            'price_asc': 'j.price ASC',
            'price_desc': 'j.price DESC',
            'popular': 'num_ventas DESC',
            'favorites': 'num_favoritos DESC'
        };

        query += ` ORDER BY ${sortOptions[sortBy] || sortOptions['name']}`;
        query += ` LIMIT 50`;

        const result = await pool.query(query, params);
        return result.rows;

    } catch (err) {
        console.error("Error en búsqueda avanzada:", err.message);
        throw err;
    }
}
async function getMostFavoritedGames(limit = 10) {
    try {
        const result = await pool.query(`
            SELECT 
                j.id,
                j.name_game,
                j.price,
                j.image,
                COUNT(f.id) AS total_favoritos
            FROM juegos j
            LEFT JOIN favoritos f ON j.id = f.game_id
            GROUP BY j.id, j.name_game, j.price, j.image
            ORDER BY total_favoritos DESC
            LIMIT $1
        `, [limit]);

        return result.rows;
    } catch (err) {
        console.error("Error al obtener juegos favoritos:", err.message);
        throw err;
    }
}


export default {
    startSession: startSession,
    createUser: createUser,
    addFavourites: addFavourites,
    addPriceCart,
    showCart,
    showCatalog,
    showFavourites,
    addGame,
    changePassword,
    deleteUser,
    getMostSoldGames,
    searchGames,
    getMostFavoritedGames
}