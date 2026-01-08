const API_URL = 'http://localhost:60000';
let currentUser = null;

async function verificarSesion() {
    try {
        const res = await fetch(`${API_URL}/get-session`, {
            credentials: 'include'
        });
        
        if (res.status === 401) {
            console.log('No hay sesión activa');
            currentUser = null;
            return;
        }
        
        if (!res.ok) {
            throw new Error(`Error ${res.status}`);
        }
        
        const data = await res.json();
        
        if (data.authenticated) {
            currentUser = data.user;
            actualizarNavbar();
        }
    } catch (err) {
        console.error('Error al verificar sesión:', err);
        currentUser = null;
    }
}

function actualizarNavbar() {
    const userInfo = document.getElementById('userInfo');
    if (currentUser) {
        userInfo.innerHTML = `
            <a href="/perfil">Perfil</a>
            <span class="user-name">${currentUser.user_name}</span>
            <a href="#" onclick="cerrarSesion(); return false;">Cerrar Sesión</a>
        `;
    } else {
        userInfo.innerHTML = `
            <a href="/login" class="btn-login">Iniciar Sesión</a>
        `;
    }
}


async function cargarCatalogo() {
    try {
        const res = await fetch(`${API_URL}/catalogo`);
        const { juegos } = await res.json();
        
        const container = document.getElementById('catalogContainer');
        
        if (juegos.length === 0) {
            container.innerHTML = '<p class="loading">No hay juegos disponibles</p>';
            return;
        }
        
        container.innerHTML = juegos.map(game => `
            <div class="game-card">
                <img src="${game.image}" 
                     alt="${game.name_game}">
                <div class="game-info">
                    <h3>${game.name_game}</h3>
                    <p class="price">$${game.price}</p>
                    <button onclick="addToFavourites('${game.name_game.replace(/'/g, "\\'")}', ${game.price})">
                        Añadir a Favoritos
                    </button>
                    <button class="btn-cart" onclick="addToCart('${game.name_game.replace(/'/g, "\\'")}', ${game.price})">
                        Añadir al Carrito
                    </button>
                </div>
            </div>
        `).join('');
        
        console.log(`${juegos.length} juegos cargados`);
    } catch (err) {
        console.error('Error al cargar catálogo:', err);
        document.getElementById('catalogContainer').innerHTML = 
            '<p class="loading">Error al cargar los juegos. Verifica que el servidor esté corriendo.</p>';
    }
}
function mostrarJuegos(juegos, container = 'catalogContainer') {
    const catalogContainer = document.getElementById(container);
    
    if (juegos.length === 0) {
        catalogContainer.innerHTML = '<p class="loading">No hay juegos disponibles</p>';
        return;
    }
    
    catalogContainer.innerHTML = juegos.map(game => `
        <div class="game-card">
            <img src="${game.image}" alt="${game.name_game}">
            <div class="game-info">
                <h3>${game.name_game}</h3>
                <p class="price">€${parseFloat(game.price).toFixed(2)}</p>
                ${game.num_ventas !== undefined ? `<p style="font-size: 12px;">💰 ${game.num_ventas} ventas | ❤️ ${game.num_favoritos} favoritos</p>` : ''}
                <button onclick="addToFavourites('${game.name_game.replace(/'/g, "\\'")}', ${game.price})">
                    Añadir a Favoritos
                </button>
                <button class="btn-cart" onclick="addToCart('${game.name_game.replace(/'/g, "\\'")}', ${game.price})">
                    Añadir al Carrito
                </button>
            </div>
        </div>
    `).join('');
    
    console.log(`${juegos.length} juegos mostrados`);
}

// Búsqueda avanzada
document.getElementById('searchForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const searchTerm = document.getElementById('searchTerm').value;
    const minPrice = document.getElementById('minPrice').value;
    const maxPrice = document.getElementById('maxPrice').value;
    const sortBy = document.getElementById('sortBy').value;

    const params = new URLSearchParams();
    if (searchTerm) params.append('q', searchTerm);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (sortBy) params.append('sortBy', sortBy);

    try {
        const res = await fetch(`${API_URL}/search?${params}`);
        const data = await res.json();

        const resultsInfo = document.getElementById('resultsInfo');
        resultsInfo.style.display = 'block';
        
        if (data.results.length === 0) {
            resultsInfo.innerHTML = '❌ No se encontraron resultados con esos criterios';
            resultsInfo.style.background = '#ffe0e0';
            document.getElementById('catalogContainer').innerHTML = 
                '<p style="text-align:center; color:#666;">No se encontraron juegos</p>';
            return;
        }

        resultsInfo.innerHTML = `✅ Se encontraron ${data.count} juegos`;
        resultsInfo.style.background = '#e0ffe0';
        
        // Mostrar resultados
        mostrarJuegos(data.results);
        
    } catch (err) {
        console.error('Error en búsqueda:', err);
        document.getElementById('resultsInfo').innerHTML = '❌ Error al realizar la búsqueda';
        document.getElementById('resultsInfo').style.background = '#ffe0e0';
        document.getElementById('resultsInfo').style.display = 'block';
    }
});

// Limpiar búsqueda
function clearSearch() {
    document.getElementById('searchForm').reset();
    document.getElementById('resultsInfo').style.display = 'none';
    cargarCatalogo(); // Recargar todos los juegos
}

// Cargar juegos más favoritos
async function loadMostFavorited() {
    try {
        const res = await fetch(`${API_URL}/stats/most-favorited?limit=10`);
        const data = await res.json();

        if (data.success && data.data.length > 0) {
            mostrarJuegos(data.data, 'mostFavoritedContainer');
        } else {
            document.getElementById('mostFavoritedContainer').innerHTML = 
                '<p style="text-align:center; color:#666;">No hay juegos favoritos aún</p>';
        }
    } catch (err) {
        console.error('Error cargando juegos favoritos:', err);
        document.getElementById('mostFavoritedContainer').innerHTML = 
            '<p style="text-align:center; color:#f44;">Error al cargar favoritos</p>';
    }
}
function irAFavoritos() {
    if (!currentUser) {
        alert('Debes iniciar sesión para ver tus favoritos');
        window.location.href = '/login';
    } else {
        window.location.href = '/favoritos';
    }
}

async function addToFavourites(gameName, price) {
    if (!currentUser) {
        alert('Debes iniciar sesión primero');
        window.location.href = '/login';
        return;
    }
    
    try {
        const res = await fetch(`${API_URL}/add-favoritos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ gameName, price })
        });
        
        if (res.status === 401) {
            alert('Tu sesión ha expirado. Por favor inicia sesión de nuevo.');
            window.location.href = '/login';
            return;
        }
        
        const data = await res.json();
        
        if (data.success) {
            alert(`${gameName} añadido a favoritos!`);
        } else {
            alert((data.message || 'Error al añadir a favoritos'));
        }
    } catch (err) {
        console.error('Error:', err);
        alert('Error al añadir a favoritos');
    }
}

async function addToCart(gameName, price) {
    if (!currentUser) {
        alert('Debes iniciar sesión primero');
        window.location.href = '/login';
        return;
    }
    
    try {
        const res = await fetch(`${API_URL}/add-carrito`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ gameName, price })
        });
        
        if (res.status === 401) {
            alert('Tu sesión ha expirado. Por favor inicia sesión de nuevo.');
            window.location.href = '/login';
            return;
        }
        
        const data = await res.json();
        
        if (data.success) {
            alert(`${gameName} añadido al carrito!`);
        } else {
            alert((data.message || 'Error al añadir al carrito'));
        }
    } catch (err) {
        console.error('Error:', err);
        alert('Error al añadir al carrito');
    }
}

verificarSesion();
cargarCatalogo();
loadMostFavorited();