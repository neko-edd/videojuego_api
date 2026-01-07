const API_URL = 'http://localhost:60000';
async function favourites() {
    try {
        const res = await fetch(`${API_URL}/favoritos`);
        const { favoritos } = await res.json()

        const container = getElementById('favorites-container')
        if (favoritos.length === 0) {
            container.innerHTML = '<p class="loading">No hay ningun favorito</p>';
            return;
        }

        container.innerHTML = favoritos.map(fav => `
            <tr>
                <td>${fav.nombre}</td>
                <td>${fav.precio}€</td>
            </tr>
        `).join('');

        console.log(`✅ ${favoritos.length} favoritos cargados`);
    } catch (err) {
        console.error('Error al cargar favoritos:', err);
        document.getElementById('favorites-container').innerHTML =
            '<p class="loading">Error al cargar los favoritos.</p>';
    }
}