const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.register = async (req, res) => {
  const { nome, email, senha, tipo } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: "Nome, email e senha são obrigatórios" });
  }

  try {
    const existing = await User.findByEmail(email);
    if (existing) {
      return res.status(409).json({ error: "Email já cadastrado" });
    }

    const hash = await bcrypt.hash(senha, 10);
    const userTipo = tipo === "admin" ? "admin" : "cliente";
    await User.create(nome, email, hash, userTipo);

    res.status(201).json({ message: "Usuário criado com sucesso" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar usuário", details: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: "Email e senha são obrigatórios" });
  }

  try {
    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(401).json({ error: "Email ou senha inválidos" });
    }

    const valid = await bcrypt.compare(senha, user.senha);
    if (!valid) {
      return res.status(401).json({ error: "Email ou senha inválidos" });
    }

    const token = jwt.sign(
      { id: user.id, tipo: user.tipo },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    res.json({
      message: "Login realizado",
      token,
      user: { id: user.id, nome: user.nome, email: user.email, tipo: user.tipo },
    });
  } catch (err) {
    res.status(500).json({ error: "Erro no login", details: err.message });
  }
};

exports.me = async (req, res) => {
  res.json({ user: req.user });
};