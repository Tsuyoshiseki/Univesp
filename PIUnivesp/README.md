# Mustache — Sistema de Agendamento para Salões

Aplicação web SaaS full-stack para agendamento em salões de beleza, semelhante ao Trinks.
Desenvolvida com Node.js + Express (backend), HTML/CSS/JavaScript puro (frontend) e MySQL.

---

## 📁 Estrutura do Projeto

```
PIUnivesp/
├── backend/
│   ├── config/
│   │   └── database.js          # MySQL connection pool
│   ├── controllers/
│   │   ├── authController.js    # Register, login, profile
│   │   ├── salonController.js   # Salon CRUD
│   │   ├── serviceController.js # Service CRUD
│   │   ├── professionalController.js
│   │   └── bookingController.js # Booking logic + slots
│   ├── models/
│   │   ├── User.js
│   │   ├── Salon.js
│   │   ├── Service.js
│   │   ├── Professional.js
│   │   └── Booking.js           # Core scheduling logic
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── salonRoutes.js
│   │   ├── serviceRoutes.js
│   │   ├── professionalRoutes.js
│   │   └── bookingRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT verify + role guard
│   ├── scripts/
│   │   └── seed.js              # Seed admin & demo data
│   ├── app.js                   # Express app setup
│   ├── server.js                # Entry point
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── index.html               # Landing page
│   ├── login.html               # Login / Register
│   ├── booking.html             # 4-step booking flow
│   ├── dashboard.html           # Admin dashboard
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── api.js               # Fetch wrapper + helpers
│       ├── login.js
│       ├── booking.js
│       └── dashboard.js
└── database/
    └── schema.sql               # Full MySQL schema + seed data
```

---

## Início Rápido

### Pré-requisitos
- **Node.js** v18+
- **MySQL** 8+
- **npm**

---

### Passo 1

```bash
cd backend
npm install
```

---

### Passo 2

```bash
cp .env.example .env
```

Adicione o `.env`:

---

### Passo 3

```bash
npm run dev
```

Entre: **http://localhost:3000**


---

## Banco de Dados

### Tabelas

| Tabela                 | Descrição                         |
|------------------------|-----------------------------------|
| `usuarios`             | Users (admin + clients)           |
| `saloes`               | Salao                             |
| `servicos`             | Serviços (nome, preço, duração)   |
| `profissionais`        | Profissionais + horas do trabalho |
| `agendamentos`         | Agendamentos                      |
| `horarios_disponiveis` | Horário disponível                |

---

## Tech Stack

| Layer      | Technology                    |
|------------|-------------------------------|
| Runtime    | Node.js 18+                   |
| Framework  | Express 4                     |
| Database   | MySQL 8 via mysql2/promise    |
| Auth       | JWT + bcrypt                  |
| Frontend   | HTML5, CSS3, Vanilla JS       |
| Pattern    | MVC REST API                  |

---

## Melhorias Futuras

- **Suporte para  Multi-salão**
- **Notificação de Whatsapp**
- **Pagamentos**
- **Lembrete de SMS**
- **Mobile app**
