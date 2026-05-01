const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Valida o JWT e anexa o usuário ao req
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token de autenticação não fornecido" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Busca usuário atualizado no banco (garante que ainda existe)
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: "Usuário não encontrado" });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expirado. Faça login novamente." });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Token inválido" });
    }
    return res.status(500).json({ error: "Erro na autenticação" });
  }
};

// Verificação de admin — usar APÓS verifyToken
// CORREÇÃO: era req.user.papel, o campo correto no schema é req.user.tipo
const requireAdmin = (req, res, next) => {
  if (req.user.tipo !== "admin") {
    return res.status(403).json({ error: "Acesso negado. Requer permissão de administrador." });
  }
  next();
};

// Token opcional — não bloqueia se ausente
const optionalToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
    }
  } catch {
    // Ignora erros de token em rotas opcionais
  }
  next();
};

module.exports = { verifyToken, requireAdmin, optionalToken };