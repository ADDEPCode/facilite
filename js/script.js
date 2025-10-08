    document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const user = document.getElementById("username").value;
        const pass = document.getElementById("password").value;
        const errorMsg = document.getElementById("error");

        // Usuários "de exemplo"
        const users = [
        { username: "admin", password: "123", role: "admin" },
        { username: "user", password: "123", role: "user" },
        ];

        const validUser = users.find(
        (u) => u.username === user && u.password === pass
        );

        if (validUser) {
        localStorage.setItem("loggedUser", JSON.stringify(validUser));
        window.location.href = "dashboard.html";
        } else {
        errorMsg.textContent = "Usuário ou senha inválidos!";
        }
    });
    });
