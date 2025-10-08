// ==================================================
// SISTEMA DE GESTÃO DE FACILITIES - MVP
// ==================================================

// -------------------------------
// CRIA ADMIN PADRÃO SE NÃO EXISTIR
// -------------------------------
if (!localStorage.getItem("usuarios")) {
    const adminPadrao = [{
        nome: "Administrador",
        email: "admin@facilite.com",
        senha: "admin123",
        role: "admin"
    }];
    localStorage.setItem("usuarios", JSON.stringify(adminPadrao));
}

// -------------------------------
// LOGIN USANDO USUÁRIOS CADASTRADOS
// -------------------------------
document.addEventListener("DOMContentLoaded", () => {
    const currentPage = window.location.pathname.split("/").pop();
    if (currentPage !== "index.html") return;

    const form = document.getElementById("loginForm");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const senha = document.getElementById("senha").value.trim();

        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

        const usuarioEncontrado = usuarios.find(
            (u) => u.email === email && u.senha === senha
        );

        if (usuarioEncontrado) {
            localStorage.setItem("loggedUser", JSON.stringify(usuarioEncontrado));
            alert(`Bem-vindo, ${usuarioEncontrado.nome}!`);
            window.location.href = "dashboard.html";
        } else {
            alert("Usuário ou senha inválidos!");
        }
    });
});

// -------------------------------
// CONTROLE DE SESSÃO (DASHBOARD)
// -------------------------------
document.addEventListener("DOMContentLoaded", () => {
    const userInfo = localStorage.getItem("loggedUser");
    const currentPage = window.location.pathname.split("/").pop();

    if (!userInfo && currentPage !== "index.html") {
        window.location.href = "index.html";
        return;
    }

    if (currentPage === "dashboard.html" && userInfo) {
        const user = JSON.parse(userInfo);
        document.getElementById("userRole").textContent = `Olá, ${user.nome} (${user.role})`;

        const adminItems = document.querySelectorAll(".admin-only");
        if (user.role !== "admin") {
            adminItems.forEach((item) => (item.style.display = "none"));
        }

        document.getElementById("logoutBtn").addEventListener("click", () => {
            localStorage.removeItem("loggedUser");
            window.location.href = "index.html";
        });
    }
});

// ---------------------
// ORDENS DE SERVIÇO
// ---------------------
document.addEventListener("DOMContentLoaded", () => {
    const currentPage = window.location.pathname.split("/").pop();
    if (currentPage !== "os.html") return;

    const form = document.getElementById("osForm");
    const tbody = document.querySelector("#osTable tbody");
    const userInfo = JSON.parse(localStorage.getItem("loggedUser"));
    const logoutBtn = document.getElementById("logoutBtn");

    let ordens = JSON.parse(localStorage.getItem("ordensServico")) || [];

    function renderTable() {
        tbody.innerHTML = "";
        ordens.forEach((os, index) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${os.numero}</td>
                <td>${os.setor}</td>
                <td>${os.solicitante}</td>
                <td>${os.tipoServico}</td>
                <td>${os.prioridade}</td>
                <td class="status-${os.status.toLowerCase()}">${os.status}</td>
                <td>
                    ${userInfo.role === "admin" ? `
                        <button class="action-btn btn-andamento" data-index="${index}" data-action="andamento">Em andamento</button>
                        <button class="action-btn btn-concluir" data-index="${index}" data-action="concluir">Concluir</button>
                    ` : ""}
                    <button class="action-btn btn-excluir" data-index="${index}" data-action="excluir">Excluir</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    renderTable();

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const novaOS = {
            numero: "OS" + String(ordens.length + 1).padStart(3, "0"),
            setor: document.getElementById("setor").value,
            solicitante: document.getElementById("solicitante").value,
            tipoServico: document.getElementById("tipoServico").value,
            descricao: document.getElementById("descricao").value,
            prioridade: document.getElementById("prioridade").value,
            status: "Aberta",
            data: new Date().toLocaleString(),
        };

        ordens.push(novaOS);
        localStorage.setItem("ordensServico", JSON.stringify(ordens));
        form.reset();
        renderTable();
    });

    tbody.addEventListener("click", (e) => {
        if (e.target.tagName === "BUTTON") {
            const index = e.target.getAttribute("data-index");
            const action = e.target.getAttribute("data-action");

            if (action === "andamento") ordens[index].status = "Em andamento";
            if (action === "concluir") ordens[index].status = "Concluída";
            if (action === "excluir") ordens.splice(index, 1);

            localStorage.setItem("ordensServico", JSON.stringify(ordens));
            renderTable();
        }
    });

    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("loggedUser");
        window.location.href = "index.html";
    });
});

// ---------------------
// CADASTRO DE SETORES
// ---------------------
document.addEventListener("DOMContentLoaded", () => {
    const currentPage = window.location.pathname.split("/").pop();
    if (currentPage !== "setores.html") return;

    const userInfo = JSON.parse(localStorage.getItem("loggedUser"));
    const form = document.getElementById("setorForm");
    const tbody = document.querySelector("#setorTable tbody");
    const logoutBtn = document.getElementById("logoutBtn");

    if (userInfo.role !== "admin") {
        alert("Acesso restrito a administradores!");
        window.location.href = "dashboard.html";
        return;
    }

    let setores = JSON.parse(localStorage.getItem("setores")) || [];

    function renderTable() {
        tbody.innerHTML = "";
        setores.forEach((setor, index) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${setor.nome}</td>
                <td>${setor.responsavel}</td>
                <td>${setor.ramal}</td>
                <td><button class="action-btn btn-excluir" data-index="${index}">Excluir</button></td>
            `;
            tbody.appendChild(tr);
        });
    }

    renderTable();

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const novoSetor = {
            nome: document.getElementById("nomeSetor").value,
            responsavel: document.getElementById("responsavel").value,
            ramal: document.getElementById("ramal").value,
        };

        setores.push(novoSetor);
        localStorage.setItem("setores", JSON.stringify(setores));
        form.reset();
        renderTable();
    });

    tbody.addEventListener("click", (e) => {
        if (e.target.classList.contains("btn-excluir")) {
            const index = e.target.getAttribute("data-index");
            setores.splice(index, 1);
            localStorage.setItem("setores", JSON.stringify(setores));
            renderTable();
        }
    });

    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("loggedUser");
        window.location.href = "index.html";
    });
});

// ---------------------
// CADASTRO DE USUÁRIOS
// ---------------------
document.addEventListener("DOMContentLoaded", () => {
    const currentPage = window.location.pathname.split("/").pop();
    if (currentPage !== "usuarios.html") return;

    const userInfo = JSON.parse(localStorage.getItem("loggedUser"));
    const logoutBtn = document.getElementById("logoutBtn");
    const form = document.getElementById("usuarioForm");
    const setorSelect = document.getElementById("setorUsuario");
    const tbody = document.querySelector("#usuarioTable tbody");

    if (userInfo.role !== "admin") {
        alert("Acesso restrito a administradores!");
        window.location.href = "dashboard.html";
        return;
    }

    const setores = JSON.parse(localStorage.getItem("setores")) || [];
    setores.forEach(setor => {
        const opt = document.createElement("option");
        opt.value = setor.nome;
        opt.textContent = setor.nome;
        setorSelect.appendChild(opt);
    });

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    function renderTable() {
        tbody.innerHTML = "";
        usuarios.forEach((user, index) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${user.nome}</td>
                <td>${user.email}</td>
                <td>${user.setor || "-"}</td>
                <td>${user.role}</td>
                <td><button class="action-btn btn-excluir" data-index="${index}">Excluir</button></td>
            `;
            tbody.appendChild(tr);
        });
    }

    renderTable();

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const novoUsuario = {
            nome: document.getElementById("nomeUsuario").value,
            email: document.getElementById("emailUsuario").value,
            setor: setorSelect.value,
            role: document.getElementById("tipoAcesso").value, // ✅ Corrigido
            senha: document.getElementById("senhaUsuario").value,
        };

        usuarios.push(novoUsuario);
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        form.reset();
        renderTable();
    });

    tbody.addEventListener("click", (e) => {
        if (e.target.classList.contains("btn-excluir")) {
            const index = e.target.getAttribute("data-index");
            usuarios.splice(index, 1);
            localStorage.setItem("usuarios", JSON.stringify(usuarios));
            renderTable();
        }
    });

    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("loggedUser");
        window.location.href = "index.html";
    });
});

// -------------------------
// RELATÓRIOS E GRÁFICOS
// -------------------------
document.addEventListener("DOMContentLoaded", () => {
    const currentPage = window.location.pathname.split("/").pop();
    if (currentPage !== "relatorios.html") return;

    const logoutBtn = document.getElementById("logoutBtn");
    const userInfo = JSON.parse(localStorage.getItem("loggedUser"));

    if (!userInfo || userInfo.role !== "admin") {
        alert("Acesso restrito a administradores!");
        window.location.href = "dashboard.html";
        return;
    }

    const osList = JSON.parse(localStorage.getItem("ordensServico")) || [];

    const totalOS = osList.length;
    const abertas = osList.filter(os => os.status === "Aberta").length;
    const andamento = osList.filter(os => os.status === "Em andamento").length;
    const concluidas = osList.filter(os => os.status === "Concluída").length;

    document.getElementById("totalOS").textContent = totalOS;
    document.getElementById("osAbertas").textContent = abertas;
    document.getElementById("osAndamento").textContent = andamento;
    document.getElementById("osConcluidas").textContent = concluidas;

    const setorCount = {};
    osList.forEach(os => {
        setorCount[os.setor] = (setorCount[os.setor] || 0) + 1;
    });

    const prioridadeCount = {};
    osList.forEach(os => {
        prioridadeCount[os.prioridade] = (prioridadeCount[os.prioridade] || 0) + 1;
    });

    const ctxSetor = document.getElementById("graficoSetor");
    new Chart(ctxSetor, {
        type: "bar",
        data: {
            labels: Object.keys(setorCount),
            datasets: [{
                label: "Quantidade de OS",
                data: Object.values(setorCount),
                backgroundColor: "rgba(0, 123, 255, 0.6)"
            }]
        },
        options: { scales: { y: { beginAtZero: true } } }
    });

    const ctxPrioridade = document.getElementById("graficoPrioridade");
    new Chart(ctxPrioridade, {
        type: "pie",
        data: {
            labels: Object.keys(prioridadeCount),
            datasets: [{
                data: Object.values(prioridadeCount),
                backgroundColor: ["#007bff", "#ffc107", "#dc3545"]
            }]
        }
    });

    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("loggedUser");
        window.location.href = "index.html";
    });
});

// -------------------------------
// LOGOUT GLOBAL
// -------------------------------
document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("loggedUser");
            window.location.href = "index.html";
        });
    }
});
