const API_URL = "http://localhost:60000";

document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const user_name = document.getElementById("user_name").value;
    const password = document.getElementById("password").value;
    const message = document.getElementById("message");

    try {
        const res = await fetch(`${API_URL}/crear-usuario`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ user_name, password })
        });

        const data = await res.json();

        if (!res.ok) {
            message.textContent = data.message;
            message.style.color = "red";
            return;
        }

        message.textContent = "Registro correcto, ya puedes iniciar sesión";
        message.style.color = "green";

    } catch (err) {
        console.error(err);
        message.textContent = "Error conectando con el servidor";
        message.style.color = "red";
    }
});