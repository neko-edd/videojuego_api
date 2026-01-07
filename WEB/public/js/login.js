const API_URL = 'http://localhost:60000';

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const user_name = document.getElementById('user_name').value;
    const password = document.getElementById('password').value;
    
    try {
        const res = await fetch(`${API_URL}/inicio-sesion`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ user_name, password })
        });
        
        const data = await res.json();
        
        if (data.success) {
            showMessage('✅ Sesión iniciada correctamente', 'success');
            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
        } else {
            showMessage('❌ ' + (data.message || 'Credenciales incorrectas'), 'error');
        }
    } catch (err) {
        console.error('Error:', err);
        showMessage('❌ Error al iniciar sesión', 'error');
    }
});

function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
}