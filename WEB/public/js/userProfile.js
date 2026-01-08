const API_URL = 'http://localhost:60000';

// Cambiar contraseña
document.getElementById('changePasswordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const oldPassword = document.getElementById('oldPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;
    
    const messageDiv = document.getElementById('changePasswordMessage');
    
    if (newPassword !== confirmNewPassword) {
        showMessage(messageDiv, 'Las contraseñas no coinciden', 'error');
        return;
    }
    
    
    try {
        const res = await fetch(`${API_URL}/change-password`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ oldPassword, newPassword })
        });
        
        const data = await res.json();
        
        if (res.ok && data.success) {
            showMessage(messageDiv, data.message, 'success');
            document.getElementById('changePasswordForm').reset();
        } else {
            showMessage(messageDiv, data.message, 'error');
        }
    } catch (err) {
        console.error('Error:', err);
        showMessage(messageDiv, 'Error al cambiar contraseña', 'error');
    }
});

// Borrar cuenta
document.getElementById('deleteUserForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const confirmDelete = confirm(
        '¿Estás seguro de que quieres borrar tu cuenta?\n\n' +
        'Esta acción NO se puede deshacer.\n' +
        'Se borrarán todos tus favoritos y datos.'
    );
    
    if (!confirmDelete) {
        return;
    }
    
    const password = document.getElementById('deletePassword').value;
    const messageDiv = document.getElementById('deleteUserMessage');
    
    try {
        const res = await fetch(`${API_URL}/delete-user`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ password })
        });
        
        const data = await res.json();
        
        if (res.ok && data.success) {
            alert(data.message + '\n\nSerás redirigido al inicio.');
            window.location.href = '/';
        } else {
            showMessage(messageDiv, data.message, 'error');
        }
    } catch (err) {
        console.error('Error:', err);
        showMessage(messageDiv, 'Error al borrar cuenta', 'error');
    }
});

function showMessage(element, text, type) {
    element.textContent = text;
    element.className = `message ${type}`;
    element.style.display = 'block';
    
    if (type === 'success') {
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }
}