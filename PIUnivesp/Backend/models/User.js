const db = require("../config/database");

const User = {
  create: async (nome, email, senha, tipo) => {
    const [result] = await db.query(
      "INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)",
      [nome, email, senha, tipo]
    );
    return result;
  },

  findByEmail: async (email) => {
    const [rows] = await db.query(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );
    return rows[0] || null;
  },

  findById: async (id) => {
    const [rows] = await db.query(
      "SELECT id, nome, email, tipo, criado_em FROM usuarios WHERE id = ?",
      [id]
    );
    return rows[0] || null;
  },
};

module.exports = User;