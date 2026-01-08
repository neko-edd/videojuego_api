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
            return false;
        }
        
        if (!res.ok) {
            throw new Error(`Error ${res.status}`);
        }
        
        const data = await res.json();
        
        if (data.authenticated) {
            currentUser = data.user;
            actualizarNavbar();
            return true;
        }
        return false;
    } catch (err) {
        console.error('Error al verificar sesión:', err);
        currentUser = null;
        return false;
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

async function cargarFavoritos() {
    const sesionActiva = await verificarSesion();
    
    try {
        const res = await fetch(`${API_URL}/favoritos`, {
            method: 'GET',
            credentials: 'include'
        });
        
        if (res.status === 401) {
            document.getElementById('favouritesContainer').innerHTML = 
                '<p class="loading">Debes <a href="/login">iniciar sesión</a> para ver tus favoritos</p>';
            return;
        }
        
        const favourites = await res.json();
        
        const container = document.getElementById('favouritesContainer');
        
        if (favourites.length === 0) {
            container.innerHTML = '<p class="loading">No tienes favoritos aún. <a href="/">Ver catálogo</a></p>';
            return;
        }
        
        container.innerHTML = favourites.map(fav => `
            <div class="game-card">
                <img src="${fav.image}" 
                     alt="${fav.name_game}">
                <div class="game-info">
                    <h3>${fav.name_game}</h3>
                    <p class="price">$${fav.price}</p>
                </div>
            </div>
        `).join('');
        
    } catch (err) {
        console.error('Error:', err);
        document.getElementById('favouritesContainer').innerHTML = 
            '<p class="loading">Error al cargar favoritos</p>';
    }
}

cargarFavoritos();