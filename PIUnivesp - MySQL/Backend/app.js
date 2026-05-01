const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const professionalRoutes = require("./routes/professionalRoutes"); 
const salaoRoutes = require("./routes/salaoRoutes");               

const app = express();

app.use(cors());
app.use(express.json());

// Serve os arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// Rotas da API
app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/professionals", professionalRoutes);
app.use("/api/salons", salaoRoutes);               

// Fallback: qualquer rota não-API serve o index.html
app.get("*", (req, res) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
  }
});

module.exports = app;