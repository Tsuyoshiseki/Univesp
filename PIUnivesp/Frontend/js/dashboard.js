// ============================================================
// js/dashboard.js — Admin dashboard com modais
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();

  if (!isAdmin()) {
    window.location.href = "/booking.html";
    return;
  }

  injectModals();

  document.querySelectorAll(".sidebar-item").forEach(item => {
    item.addEventListener("click", () => {
      document.querySelectorAll(".sidebar-item").forEach(i => i.classList.remove("active"));
      item.classList.add("active");
      showSection(item.dataset.section);
    });
  });

  showSection("overview");
});

// ── Modal engine ─────────────────────────────────────────────
function injectModals() {
  document.body.insertAdjacentHTML("beforeend", `
    <div id="modal-overlay" class="modal-overlay hidden" onclick="closeModal()"></div>

    <div id="modal-service" class="modal hidden">
      <div class="modal-header">
        <h3>✂️ Novo Serviço</h3>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <div class="modal-body">
        <div id="modal-service-error" class="alert alert-error hidden"></div>
        <div class="form-group">
          <label>Nome do serviço</label>
          <input type="text" id="svc-nome" class="form-control" placeholder="Ex: Corte masculino">
        </div>
        <div class="form-group">
          <label>Preço (R$)</label>
          <input type="number" id="svc-preco" class="form-control" placeholder="Ex: 50.00" min="0" step="0.01">
        </div>
        <div class="form-group">
          <label>Duração (minutos)</label>
          <input type="number" id="svc-duracao" class="form-control" placeholder="Ex: 30" min="5" step="5">
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline" onclick="closeModal()">Cancelar</button>
        <button class="btn btn-primary" id="btn-save-service">Salvar Serviço</button>
      </div>
    </div>

    <div id="modal-prof" class="modal hidden">
      <div class="modal-header">
        <h3>👤 Novo Profissional</h3>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <div class="modal-body">
        <div id="modal-prof-error" class="alert alert-error hidden"></div>
        <div class="form-group">
          <label>Nome</label>
          <input type="text" id="prof-nome" class="form-control" placeholder="Ex: Ana Silva">
        </div>
        <div class="form-group">
          <label>Especialidades</label>
          <input type="text" id="prof-espec" class="form-control" placeholder="Ex: Corte, Coloração">
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline" onclick="closeModal()">Cancelar</button>
        <button class="btn btn-primary" id="btn-save-prof">Salvar Profissional</button>
      </div>
    </div>

    <div id="modal-confirm" class="modal modal-sm hidden">
      <div class="modal-header">
        <h3 id="confirm-title">Confirmar</h3>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <div class="modal-body">
        <p id="confirm-message" style="color:#444;line-height:1.6"></p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline" onclick="closeModal()">Cancelar</button>
        <button class="btn btn-danger" id="btn-confirm-ok">Confirmar</button>
      </div>
    </div>
  `);

  document.getElementById("btn-save-service").addEventListener("click", saveService);
  document.getElementById("btn-save-prof").addEventListener("click", saveProfessional);
}

function openModal(id) {
  document.getElementById("modal-overlay").classList.remove("hidden");
  document.getElementById(id).classList.remove("hidden");
}

function closeModal() {
  document.getElementById("modal-overlay").classList.add("hidden");
  document.querySelectorAll(".modal").forEach(m => m.classList.add("hidden"));
}

function confirmDialog(title, message) {
  return new Promise((resolve) => {
    document.getElementById("confirm-title").textContent = title;
    document.getElementById("confirm-message").textContent = message;
    openModal("modal-confirm");

    const btn = document.getElementById("btn-confirm-ok");
    const handler = () => {
      closeModal();
      btn.removeEventListener("click", handler);
      resolve(true);
    };
    btn.addEventListener("click", handler);
  });
}

// ── Seções ───────────────────────────────────────────────────
function showSection(name) {
  document.querySelectorAll(".dash-section").forEach(s => s.classList.add("hidden"));
  const section = document.getElementById(`section-${name}`);
  if (section) section.classList.remove("hidden");

  if (name === "overview")      loadOverview();
  if (name === "bookings")      loadBookings();
  if (name === "services")      loadServices();
  if (name === "professionals") loadProfessionals();
}

// ── Visão Geral ──────────────────────────────────────────────
async function loadOverview() {
  const grid = document.querySelector(".stats-grid");
  grid.innerHTML = `<div class="spinner"></div>`;

  try {
    const [bookings, services, professionals] = await Promise.all([
      apiFetch("/bookings"),
      apiFetch("/services"),
      apiFetch("/professionals"),
    ]);

    const total      = bookings.length;
    const confirmado = bookings.filter(b => b.status === "confirmado").length;
    const cancelado  = bookings.filter(b => b.status === "cancelado").length;
    const concluido  = bookings.filter(b => b.status === "concluido").length;

    grid.innerHTML = `
      <div class="stat-card">
        <div class="stat-icon">📅</div>
        <div class="stat-value">${total}</div>
        <div class="stat-label">Total de Agendamentos</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-value">${confirmado}</div>
        <div class="stat-label">Confirmados</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">✔️</div>
        <div class="stat-value">${concluido}</div>
        <div class="stat-label">Concluídos</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">❌</div>
        <div class="stat-value">${cancelado}</div>
        <div class="stat-label">Cancelados</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">✂️</div>
        <div class="stat-value">${services.length}</div>
        <div class="stat-label">Serviços</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">👤</div>
        <div class="stat-value">${professionals.length}</div>
        <div class="stat-label">Profissionais</div>
      </div>
    `;
  } catch (err) {
    grid.innerHTML = `<p class="text-danger">Erro ao carregar dados: ${err.message}</p>`;
  }
}

// ── Agendamentos ─────────────────────────────────────────────
let bookingsListenerAttached = false;

async function loadBookings() {
  if (!bookingsListenerAttached) {
    document.getElementById("btn-filter-bookings").addEventListener("click", loadBookings);
    bookingsListenerAttached = true;
  }

  const filterDate   = document.getElementById("filter-date").value;
  const filterStatus = document.getElementById("filter-status").value;
  const tbody = document.getElementById("bookings-tbody");
  tbody.innerHTML = `<tr><td colspan="8"><div class="spinner" style="margin:.5rem auto"></div></td></tr>`;

  try {
    let url = "/bookings";
    const params = new URLSearchParams();
    if (filterDate)   params.set("data", filterDate);
    if (filterStatus) params.set("status", filterStatus);
    if (params.toString()) url += "?" + params.toString();

    const bookings = await apiFetch(url);

    if (!bookings.length) {
      tbody.innerHTML = `<tr><td colspan="8" class="text-center text-muted" style="padding:1.5rem">Nenhum agendamento encontrado.</td></tr>`;
      return;
    }

    tbody.innerHTML = bookings.map(b => `
      <tr>
        <td>${b.id}</td>
        <td>${b.usuario_nome || b.usuario_id}</td>
        <td>${b.servico}</td>
        <td>${b.profissional}</td>
        <td>${formatDate(b.data)}</td>
        <td>${b.hora?.slice(0,5)}</td>
        <td>${statusBadge(b.status)}</td>
        <td>
          <select class="form-control" style="padding:.2rem .4rem;font-size:.8rem;width:auto"
                  onchange="updateStatus(${b.id}, this.value, this)">
            <option value="confirmado" ${b.status==="confirmado"?"selected":""}>Confirmado</option>
            <option value="concluido"  ${b.status==="concluido" ?"selected":""}>Concluído</option>
            <option value="cancelado"  ${b.status==="cancelado" ?"selected":""}>Cancelado</option>
          </select>
        </td>
      </tr>
    `).join("");
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-danger" style="padding:1rem">Erro: ${err.message}</td></tr>`;
  }
}

async function updateStatus(id, status, select) {
  select.disabled = true;
  try {
    await apiFetch(`/bookings/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  } catch (err) {
    alert("Erro ao atualizar status: " + err.message);
  } finally {
    select.disabled = false;
  }
}

// ── Serviços ─────────────────────────────────────────────────
async function loadServices() {
  const tbody = document.getElementById("services-tbody");
  tbody.innerHTML = `<tr><td colspan="5"><div class="spinner" style="margin:.5rem auto"></div></td></tr>`;

  document.getElementById("btn-new-service").onclick = () => {
    document.getElementById("svc-nome").value = "";
    document.getElementById("svc-preco").value = "";
    document.getElementById("svc-duracao").value = "";
    document.getElementById("modal-service-error").classList.add("hidden");
    openModal("modal-service");
  };

  try {
    const services = await apiFetch("/services");

    if (!services.length) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted" style="padding:1.5rem">Nenhum serviço cadastrado.</td></tr>`;
      return;
    }

    tbody.innerHTML = services.map(s => `
      <tr>
        <td>${s.nome}</td>
        <td>${s.descricao || "-"}</td>
        <td>${formatCurrency(s.preco)}</td>
        <td>${s.duracao} min</td>
        <td>
          <button class="btn btn-sm btn-danger" onclick="deleteService(${s.id}, this)">Remover</button>
        </td>
      </tr>
    `).join("");
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-danger">Erro: ${err.message}</td></tr>`;
  }
}

async function saveService() {
  const nome    = document.getElementById("svc-nome").value.trim();
  const preco   = parseFloat(document.getElementById("svc-preco").value);
  const duracao = parseInt(document.getElementById("svc-duracao").value);
  const errorEl = document.getElementById("modal-service-error");

  if (!nome || isNaN(preco) || isNaN(duracao)) {
    errorEl.textContent = "Preencha todos os campos corretamente.";
    errorEl.classList.remove("hidden");
    return;
  }

  const btn = document.getElementById("btn-save-service");
  btn.disabled = true;
  btn.textContent = "Salvando...";

  try {
    await apiFetch("/services", {
      method: "POST",
      body: JSON.stringify({ nome, preco, duracao, salao_id: 1 }),
    });
    closeModal();
    loadServices();
  } catch (err) {
    errorEl.textContent = err.message;
    errorEl.classList.remove("hidden");
  } finally {
    btn.disabled = false;
    btn.textContent = "Salvar Serviço";
  }
}

async function deleteService(id, btn) {
  const ok = await confirmDialog("Remover Serviço", "Tem certeza que deseja remover este serviço?");
  if (!ok) return;
  btn.disabled = true;
  try {
    await apiFetch(`/services/${id}`, { method: "DELETE" });
    loadServices();
  } catch (err) {
    alert("Erro: " + err.message);
    btn.disabled = false;
  }
}

// ── Profissionais ────────────────────────────────────────────
async function loadProfessionals() {
  const tbody = document.getElementById("professionals-tbody");
  tbody.innerHTML = `<tr><td colspan="5"><div class="spinner" style="margin:.5rem auto"></div></td></tr>`;

  document.getElementById("btn-new-prof").onclick = () => {
    document.getElementById("prof-nome").value = "";
    document.getElementById("prof-espec").value = "";
    document.getElementById("modal-prof-error").classList.add("hidden");
    openModal("modal-prof");
  };

  try {
    const professionals = await apiFetch("/professionals");

    if (!professionals.length) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted" style="padding:1.5rem">Nenhum profissional cadastrado.</td></tr>`;
      return;
    }

    tbody.innerHTML = professionals.map(p => `
      <tr>
        <td>${p.nome}</td>
        <td>${p.especialidades || "-"}</td>
        <td>${p.horario_inicio ? p.horario_inicio + " – " + p.horario_fim : "-"}</td>
        <td>${p.dias_trabalho || "-"}</td>
        <td>
          <button class="btn btn-sm btn-danger" onclick="deleteProfessional(${p.id}, this)">Remover</button>
        </td>
      </tr>
    `).join("");
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-danger">Erro: ${err.message}</td></tr>`;
  }
}

async function saveProfessional() {
  const nome           = document.getElementById("prof-nome").value.trim();
  const especialidades = document.getElementById("prof-espec").value.trim();
  const errorEl        = document.getElementById("modal-prof-error");

  if (!nome) {
    errorEl.textContent = "Nome é obrigatório.";
    errorEl.classList.remove("hidden");
    return;
  }

  const btn = document.getElementById("btn-save-prof");
  btn.disabled = true;
  btn.textContent = "Salvando...";

  try {
    await apiFetch("/professionals", {
      method: "POST",
      body: JSON.stringify({ nome, especialidades, salao_id: 1 }),
    });
    closeModal();
    loadProfessionals();
  } catch (err) {
    errorEl.textContent = err.message;
    errorEl.classList.remove("hidden");
  } finally {
    btn.disabled = false;
    btn.textContent = "Salvar Profissional";
  }
}

async function deleteProfessional(id, btn) {
  const ok = await confirmDialog("Remover Profissional", "Tem certeza que deseja remover este profissional?");
  if (!ok) return;
  btn.disabled = true;
  try {
    await apiFetch(`/professionals/${id}`, { method: "DELETE" });
    loadProfessionals();
  } catch (err) {
    alert("Erro: " + err.message);
    btn.disabled = false;
  }
}