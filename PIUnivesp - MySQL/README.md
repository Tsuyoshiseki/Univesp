# Mustache — Sistema de Agendamento para Salões

Aplicação web SaaS full-stack para agendamento em salões de beleza, semelhante ao Trinks.
Desenvolvida com Node.js + Express (backend), HTML/CSS/JavaScript puro (frontend) e MySQL.

---

## 📁 Estrutura do Projeto

```
PIUnivesp/
├── backend/
│ ├── config/
│ │ └── database.js # Pool de conexão MySQL
│ ├── controllers/
│ │ ├── authController.js # Registro, login, perfil
│ │ ├── salonController.js # CRUD de salões
│ │ ├── serviceController.js # CRUD de serviços
│ │ ├── professionalController.js
│ │ └── bookingController.js # Lógica de agendamento + horários
│ ├── models/
│ │ ├── User.js
│ │ ├── Salon.js
│ │ ├── Service.js
│ │ ├── Professional.js
│ │ └── Booking.js # Lógica principal de agenda
│ ├── routes/
│ │ ├── authRoutes.js
│ │ ├── salonRoutes.js
│ │ ├── serviceRoutes.js
│ │ ├── professionalRoutes.js
│ │ └── bookingRoutes.js
│ ├── middleware/
│ │ └── authMiddleware.js # Verificação JWT + controle de acesso
│ ├── scripts/
│ │ └── seed.js # Dados iniciais (admin + demo)
│ ├── app.js # Configuração do Express
│ ├── server.js # Ponto de entrada
│ ├── package.json
│ └── .env.example
├── frontend/
│ ├── index.html # Página inicial
│ ├── login.html # Login / Cadastro
│ ├── booking.html # Fluxo de agendamento (4 etapas)
│ ├── dashboard.html # Painel administrativo
│ ├── css/
│ │ └── style.css
│ └── js/
│ ├── api.js # Wrapper de requisições
│ ├── login.js
│ ├── booking.js
│ └── dashboard.js
└── database/
└── schema.sql # Schema completo + dados iniciais
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
