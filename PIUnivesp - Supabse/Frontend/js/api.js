// ============================================================
// js/api.js — Fetch wrapper + helpers de autenticação
// Incluir antes de qualquer outro script de página
// ============================================================

const API_BASE = "/api";

// ── Token helpers ────────────────────────────────────────────
function getToken() {
  return localStorage.getItem("token");
}

function getUser() {
  const raw = localStorage.getItem("user");
  try { return raw ? JSON.parse(raw) : null; } catch { return null; }
}

function saveAuth(token, user) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

function isAdmin() {
  const u = getUser();
  return u && u.tipo === "admin";
}

// ── Fetch wrapper ────────────────────────────────────────────
async function apiFetch(path, options = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(API_BASE + path, { ...options, headers });

  // Token expirado → redireciona para login
  if (res.status === 401) {
    clearAuth();
    window.location.href = "/login.html";
    return;
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.message || "Erro desconhecido");
  }

  return data;
}

// ── Navbar ───────────────────────────────────────────────────
function initNavbar() {
  const user = getUser();

  if (!user) {
    window.location.href = "/login.html";
    return;
  }

  const avatarEl = document.getElementById("nav-avatar");
  const nameEl   = document.getElementById("nav-name");
  const logoutEl = document.getElementById("nav-logout");
  const adminLink = document.getElementById("nav-admin-link");

  if (avatarEl) avatarEl.textContent = user.nome?.charAt(0).toUpperCase() || "?";
  if (nameEl)   nameEl.textContent   = user.nome || "";
  if (adminLink && isAdmin()) adminLink.style.display = "";

  if (logoutEl) {
    logoutEl.addEventListener("click", (e) => {
      e.preventDefault();
      clearAuth();
      window.location.href = "/login.html";
    });
  }
}

// ── Formatação ───────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("pt-BR");
}

function formatCurrency(value) {
  return Number(value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function statusBadge(status) {
  const map = {
    confirmado: "badge-success",
    cancelado:  "badge-danger",
    concluido:  "badge-info",
    pendente:   "badge-warning",
  };
  const cls = map[status] || "badge-secondary";
  return `<span class="badge ${cls}">${status}</span>`;
}