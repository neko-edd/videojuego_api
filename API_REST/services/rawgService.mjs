import fetch from "node-fetch";
import 'dotenv/config';

async function obtenerJuegosRAWG() {
    const apiKey = process.env.RAWG_API_KEY;
    const url = `https://api.rawg.io/api/games?key=${apiKey}&page_size=30`;

    try {
        const res = await fetch(url);
        if (!res.ok){
            throw new Error(`HTTP error! status: ${res.status}`);
        } 
        const data = await res.json();

        return data.results; // Array de juegos
    } catch (err) {
        console.error("Error al llamar a RAWG:", err.message);
        return [];
    }
}

export default { obtenerJuegosRAWG };