const API_URL = 'http://localhost:60000';
let currentUser = null;

// Verificar sesión al cargar
async function verificarSesion() {
    try {
        const res = await fetch(`${API_URL}/get-session`, {
            credentials: 'include'
        });
        const data = await res.json();
        
        if (data.authenticated) {
            currentUser = data.user;
            actualizarNavbar();
        }
    } catch (err) {
        console.log('No hay sesión activa');
    }
}

// Actualizar la navbar con info del usuario
function updateNavbar() {
    const userInfo = document.getElementById('userInfo');
    if (currentUser) {
        userInfo.innerHTML = `
            <span class="user-name">👤 ${currentUser.user_name}</span>
        `;
    } else {
        userInfo.innerHTML = `
            <a href="/login">Iniciar Sesión</a>
        `;
    }
}

// Cargar catálogo de juegos
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
                        ❤️ Añadir a Favoritos
                    </button>
                    <button class="btn-cart" onclick="addToCart('${game.name_game.replace(/'/g, "\\'")}', ${game.price})">
                        🛒 Añadir al Carrito
                    </button>
                </div>
            </div>
        `).join('');
        
        console.log(`✅ ${juegos.length} juegos cargados`);
    } catch (err) {
        console.error('❌ Error al cargar catálogo:', err);
        document.getElementById('catalogContainer').innerHTML = 
            '<p class="loading">Error al cargar los juegos. Verifica que el servidor esté corriendo.</p>';
    }
}

// Añadir a favoritos
async function addToFavourites(gameName, price) {
    if (!currentUser) {
        alert('⚠️ Debes iniciar sesión primero');
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
            alert('⚠️ Tu sesión ha expirado. Por favor inicia sesión de nuevo.');
            window.location.href = '/login';
            return;
        }
        
        const data = await res.json();
        
        if (data.success) {
            alert(`✅ ${gameName} añadido a favoritos!`);
        } else {
            alert('❌ ' + ('Error al añadir a favoritos'));
        }
    } catch (err) {
        console.error('Error:', err);
        alert('❌ Error al añadir a favoritos');
    }
}

// Inicializar al cargar la página
verificarSesion();
cargarCatalogo();