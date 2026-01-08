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
        `;
    } else {
        userInfo.innerHTML = `
            <a href="/login" class="btn-login">Iniciar Sesión</a>
        `;
    }
}

async function cargarCarrito() {
    const sesionActiva = await verificarSesion();
    
    try {
        const res = await fetch(`${API_URL}/carrito`, {
            method: 'POST',
            credentials: 'include'
        });
        
        const container = document.getElementById('carritoContainer');
        
        if (res.status === 401) {
            container.innerHTML = `
                <p class="loading">
                    Debes <a href="/login">iniciar sesión</a> para ver tu carrito
                </p>
            `;
            return;
        }
        
        if (!res.ok) {
            throw new Error(`Error ${res.status}`);
        }
        
        const { carrito } = await res.json();
        
        if (!carrito || carrito.length === 0) {
            container.innerHTML = `
                <p class="loading">
                    Tu carrito está vacío. <a href="/">Ver catálogo</a>
                </p>
            `;
            actualizarResumen(0, 0);
            return;
        }
        
        const total = carrito.reduce((sum, item) => sum + parseFloat(item.price), 0);
        
        container.innerHTML = carrito.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image || 'https://via.placeholder.com/100x100?text=No+Image'}" 
                     alt="${item.name_game}"
                     onerror="this.src='https://via.placeholder.com/100x100?text=No+Image'">
                <div class="cart-item-info">
                    <h3>${item.name_game}</h3>
                    <p class="price">$${parseFloat(item.price).toFixed(2)}</p>
                    ${item.offer ? '<span class="offer-badge">OFERTA</span>' : ''}
                </div>
            </div>
        `).join('');
        
        actualizarResumen(carrito.length, total);
        
        console.log(`${carrito.length} items en el carrito`);
        
    } catch (err) {
        console.error('Error al cargar carrito:', err);
        document.getElementById('carritoContainer').innerHTML = `
            <p class="loading">
                Error al cargar el carrito. <a href="/">Volver al inicio</a>
            </p>
        `;
    }
}

function actualizarResumen(count, total) {
    document.getElementById('cartCount').textContent = `${count} items`;
    document.getElementById('cartTotal').textContent = `Total: $${total.toFixed(2)}`;
    
    const btnComprar = document.getElementById('buyBtn');
    if (btnComprar) {
        btnComprar.disabled = count === 0;
    }
}

async function realizarCompra() {
    if (!currentUser) {
        alert('Debes iniciar sesión para comprar');
        window.location.href = '/login';
        return;
    }
    
    try {
        const res = await fetch(`${API_URL}/comprar`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (res.status === 401) {
            alert('Tu sesión ha expirado. Por favor inicia sesión de nuevo.');
            window.location.href = '/login';
            return;
        }
        
        const data = await res.json();
        
        if (data.success) {
            alert('¡Compra realizada con éxito!');
            cargarCarrito(); 
        } else {
            alert((data.message || 'Error al realizar la compra'));
        }
    } catch (err) {
        console.error('Error:', err);
        alert('Error al procesar la compra');
    }
}

cargarCarrito();