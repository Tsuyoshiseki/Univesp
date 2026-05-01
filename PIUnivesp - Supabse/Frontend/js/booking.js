// ============================================================
// Fluxo de agendamento em 4 passos
// ============================================================

let currentStep = 1;
const state = {
  servico:      null,
  profissional: null,
  data:         null,
  hora:         null,
};

// ── Init ─────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  loadStep1();

  document.getElementById("btn-next").addEventListener("click", nextStep);
  document.getElementById("btn-back").addEventListener("click", prevStep);
  document.getElementById("show-my-bookings").addEventListener("click", loadMyBookings);
});

// ── Navegação entre passos ───────────────────────────────────
function goToStep(n) {
  document.getElementById(`step-${currentStep}`).classList.add("hidden");
  document.getElementById(`step-indicator-${currentStep}`).classList.remove("active");

  currentStep = n;

  document.getElementById(`step-${currentStep}`).classList.remove("hidden");
  document.getElementById(`step-indicator-${currentStep}`).classList.add("active");

  document.getElementById("btn-back").classList.toggle("hidden", currentStep === 1);
  document.getElementById("btn-next").textContent =
    currentStep === 4 ? "Confirmar Agendamento ✓" : "Continuar →";
  document.getElementById("btn-next").disabled = true;
}

async function nextStep() {
  if (currentStep === 1 && state.servico)      { goToStep(2); loadStep2(); }
  else if (currentStep === 2 && state.profissional) { goToStep(3); loadStep3(); }
  else if (currentStep === 3 && state.data && state.hora) { goToStep(4); loadStep4(); }
  else if (currentStep === 4)                  { await confirmBooking(); }
}

function prevStep() {
  if (currentStep > 1) {
    goToStep(currentStep - 1);
    document.getElementById("btn-next").disabled = false;
  }
}

// ── Passo 1: Serviços ────────────────────────────────────────
async function loadStep1() {
  const container = document.getElementById("step-1-content");
  try {
    const services = await apiFetch("/services");
    if (!services.length) {
      container.innerHTML = `<p class="text-muted text-center">Nenhum serviço disponível.</p>`;
      return;
    }

    container.innerHTML = services.map(s => `
      <div class="service-card" data-id="${s.id}" data-nome="${s.nome}" data-preco="${s.preco}" data-duracao="${s.duracao}">
        <div class="service-info">
          <strong>${s.nome}</strong>
          <span class="text-muted">${s.duracao} min</span>
        </div>
        <span class="service-price">${formatCurrency(s.preco)}</span>
      </div>
    `).join("");

    container.querySelectorAll(".service-card").forEach(card => {
      card.addEventListener("click", () => {
        container.querySelectorAll(".service-card").forEach(c => c.classList.remove("selected"));
        card.classList.add("selected");
        state.servico = {
          id:      card.dataset.id,
          nome:    card.dataset.nome,
          preco:   card.dataset.preco,
          duracao: card.dataset.duracao,
        };
        document.getElementById("btn-next").disabled = false;
      });
    });
  } catch (err) {
    container.innerHTML = `<p class="text-danger">Erro ao carregar serviços: ${err.message}</p>`;
  }
}

// ── Passo 2: Profissionais ───────────────────────────────────
async function loadStep2() {
  const container = document.getElementById("step-2-content");
  container.innerHTML = `<div class="spinner"></div>`;
  try {
    const professionals = await apiFetch("/professionals");
    if (!professionals.length) {
      container.innerHTML = `<p class="text-muted text-center">Nenhum profissional disponível.</p>`;
      return;
    }

    container.innerHTML = professionals.map(p => `
      <div class="service-card" data-id="${p.id}" data-nome="${p.nome}">
        <div class="service-info">
          <strong>${p.nome}</strong>
          <span class="text-muted">${p.especialidades || "Profissional"}</span>
        </div>
      </div>
    `).join("");

    container.querySelectorAll(".service-card").forEach(card => {
      card.addEventListener("click", () => {
        container.querySelectorAll(".service-card").forEach(c => c.classList.remove("selected"));
        card.classList.add("selected");
        state.profissional = { id: card.dataset.id, nome: card.dataset.nome };
        document.getElementById("btn-next").disabled = false;
      });
    });
  } catch (err) {
    container.innerHTML = `<p class="text-danger">Erro ao carregar profissionais: ${err.message}</p>`;
  }
}

// ── Passo 3: Data e hora ─────────────────────────────────────
function loadStep3() {
  const container = document.getElementById("step-3-content");

  const today = new Date().toISOString().split("T")[0];

  container.innerHTML = `
    <div class="form-group">
      <label>Data</label>
      <input type="date" id="pick-data" class="form-control" min="${today}">
    </div>
    <div class="form-group" id="hora-group" style="display:none">
      <label>Horário</label>
      <div id="hora-slots" class="slots-grid"></div>
    </div>
  `;

  document.getElementById("pick-data").addEventListener("change", async (e) => {
    state.data = e.target.value;
    state.hora = null;
    document.getElementById("btn-next").disabled = true;
    await loadSlots(state.data);
  });
}

async function loadSlots(data) {
  const horaGroup = document.getElementById("hora-group");
  const slotsDiv  = document.getElementById("hora-slots");

  horaGroup.style.display = "block";
  slotsDiv.innerHTML = `<div class="spinner"></div>`;

  // Gera slots de 30 em 30 min entre 08:00 e 18:00
  const slots = [];
  for (let h = 8; h < 18; h++) {
    slots.push(`${String(h).padStart(2,"0")}:00`);
    slots.push(`${String(h).padStart(2,"0")}:30`);
  }

  // Busca horários já ocupados
  let ocupados = [];
  try {
    const bookings = await apiFetch(`/bookings?profissional_id=${state.profissional.id}&data=${data}`).catch(() => []);
    ocupados = (bookings || []).map(b => b.hora?.slice(0,5));
  } catch {}

  slotsDiv.innerHTML = slots.map(slot => {
    const busy = ocupados.includes(slot);
    return `<button class="slot-btn ${busy ? "slot-busy" : ""}" 
                    data-hora="${slot}" 
                    ${busy ? "disabled" : ""}>${slot}</button>`;
  }).join("");

  slotsDiv.querySelectorAll(".slot-btn:not([disabled])").forEach(btn => {
    btn.addEventListener("click", () => {
      slotsDiv.querySelectorAll(".slot-btn").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      state.hora = btn.dataset.hora;
      document.getElementById("btn-next").disabled = false;
    });
  });
}

// ── Passo 4: Confirmação ─────────────────────────────────────
function loadStep4() {
  const container = document.getElementById("step-4-content");
  container.innerHTML = `
    <div class="confirm-summary">
      <div class="confirm-row">
        <span>✂️ Serviço</span>
        <strong>${state.servico.nome} — ${formatCurrency(state.servico.preco)}</strong>
      </div>
      <div class="confirm-row">
        <span>👤 Profissional</span>
        <strong>${state.profissional.nome}</strong>
      </div>
      <div class="confirm-row">
        <span>📅 Data</span>
        <strong>${formatDate(state.data)}</strong>
      </div>
      <div class="confirm-row">
        <span>🕐 Horário</span>
        <strong>${state.hora}</strong>
      </div>
      <div class="confirm-row">
        <span>⏱️ Duração</span>
        <strong>${state.servico.duracao} min</strong>
      </div>
    </div>
    <div id="booking-result"></div>
  `;
  document.getElementById("btn-next").disabled = false;
}

async function confirmBooking() {
  const btn = document.getElementById("btn-next");
  btn.disabled = true;
  btn.textContent = "Aguarde...";

  try {
    await apiFetch("/bookings", {
      method: "POST",
      body: JSON.stringify({
        servico_id:      state.servico.id,
        profissional_id: state.profissional.id,
        data:            state.data,
        hora:            state.hora,
      }),
    });

    document.getElementById("booking-result").innerHTML = `
      <div class="alert alert-success" style="margin-top:1rem">
        ✅ Agendamento confirmado com sucesso!
      </div>
    `;
    btn.style.display = "none";

    // Reseta estado após 2s e volta ao passo 1
    setTimeout(() => {
      state.servico = state.profissional = state.data = state.hora = null;
      goToStep(1);
      loadStep1();
      btn.style.display = "";
      btn.textContent = "Continuar →";
    }, 2500);

  } catch (err) {
    document.getElementById("booking-result").innerHTML = `
      <div class="alert alert-error" style="margin-top:1rem">
        ❌ ${err.message}
      </div>
    `;
    btn.disabled = false;
    btn.textContent = "Confirmar Agendamento ✓";
  }
}

// ── Meus agendamentos ────────────────────────────────────────
async function loadMyBookings() {
  const panel = document.getElementById("my-bookings-panel");
  panel.innerHTML = `<div class="spinner"></div>`;

  try {
    const bookings = await apiFetch("/bookings/my");

    if (!bookings.length) {
      panel.innerHTML = `<p class="text-muted text-center" style="padding:1rem">Você não tem agendamentos.</p>`;
      return;
    }

    panel.innerHTML = `
      <table style="width:100%;border-collapse:collapse">
        <thead>
          <tr>
            <th style="text-align:left;padding:.5rem;border-bottom:1px solid var(--border)">Serviço</th>
            <th style="text-align:left;padding:.5rem;border-bottom:1px solid var(--border)">Profissional</th>
            <th style="text-align:left;padding:.5rem;border-bottom:1px solid var(--border)">Data</th>
            <th style="text-align:left;padding:.5rem;border-bottom:1px solid var(--border)">Hora</th>
            <th style="text-align:left;padding:.5rem;border-bottom:1px solid var(--border)">Status</th>
            <th style="padding:.5rem;border-bottom:1px solid var(--border)"></th>
          </tr>
        </thead>
        <tbody>
          ${bookings.map(b => `
            <tr>
              <td style="padding:.5rem">${b.servico}</td>
              <td style="padding:.5rem">${b.profissional}</td>
              <td style="padding:.5rem">${formatDate(b.data)}</td>
              <td style="padding:.5rem">${b.hora?.slice(0,5)}</td>
              <td style="padding:.5rem">${statusBadge(b.status)}</td>
              <td style="padding:.5rem">
                ${b.status === "confirmado" ? `
                  <button class="btn btn-sm btn-danger" onclick="cancelBooking(${b.id}, this)">Cancelar</button>
                ` : ""}
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  } catch (err) {
    panel.innerHTML = `<p class="text-danger">Erro: ${err.message}</p>`;
  }
}

async function cancelBooking(id, btn) {
  if (!confirm("Cancelar este agendamento?")) return;
  btn.disabled = true;
  try {
    await apiFetch(`/bookings/${id}/cancel`, { method: "PATCH" });
    loadMyBookings();
  } catch (err) {
    alert("Erro ao cancelar: " + err.message);
    btn.disabled = false;
  }
}