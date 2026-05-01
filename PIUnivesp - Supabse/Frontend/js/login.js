// ============================================================
// Login e registro
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  // Se já está logado, redireciona
  if (getToken()) {
    window.location.href = isAdmin() ? "/dashboard.html" : "/booking.html";
    return;
  }

  // Tabs login / registro
  document.querySelectorAll(".auth-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".auth-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      document.getElementById("panel-login").classList.toggle("hidden", tab.dataset.tab !== "login");
      document.getElementById("panel-register").classList.toggle("hidden", tab.dataset.tab !== "register");
    });
  });

  // Login
  document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const errorEl = document.getElementById("login-error");
    errorEl.classList.add("hidden");

    const email = document.getElementById("login-email").value.trim();
    const senha  = document.getElementById("login-senha").value;

    try {
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, senha }),
      });

      saveAuth(data.token, data.user);
      window.location.href = data.user.tipo === "admin" ? "/dashboard.html" : "/booking.html";
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.classList.remove("hidden");
    }
  });

  // Registro
  document.getElementById("register-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const errorEl = document.getElementById("reg-error");
    errorEl.classList.add("hidden");

    const nome    = document.getElementById("reg-nome").value.trim();
    const email   = document.getElementById("reg-email").value.trim();
    const telefone = document.getElementById("reg-tel").value.trim();
    const senha   = document.getElementById("reg-senha").value;
    const confirm = document.getElementById("reg-confirm").value;

    if (senha !== confirm) {
      errorEl.textContent = "As senhas não coincidem.";
      errorEl.classList.remove("hidden");
      return;
    }

    if (senha.length < 6) {
      errorEl.textContent = "A senha deve ter pelo menos 6 caracteres.";
      errorEl.classList.remove("hidden");
      return;
    }

    try {
      await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({ nome, email, senha, telefone }),
      });

      // Após registro faz login automático
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, senha }),
      });

      saveAuth(data.token, data.user);
      window.location.href = "/booking.html";
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.classList.remove("hidden");
    }
  });
});