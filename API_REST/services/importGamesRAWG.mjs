import rawgService from "./rawgService.mjs";
import RepoTask from "../repositories/task_repository.mjs";
import 'dotenv/config';

//console.log("API KEY cargada:", process.env.RAWG_API_KEY);

export async function importGames() {
    const juegosRAWG = await rawgService.obtenerJuegosRAWG();

    const juegosProcesados = juegosRAWG.map(j => ({
        name_game: j.name,
        price: Math.floor(Math.random() * 51) + 10,
        image: j.background_image
    }));

    for (const juego of juegosProcesados) {
        await RepoTask.addGame(juego.name_game, juego.price, juego.image);
    }

    console.log("Importación completada!");
}

export default {importGames}
