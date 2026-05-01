const db = require("../config/database");

const User = {
  create: async (nome, email, senha, tipo) => {
    const { rows } = await db.query(
      "INSERT INTO usuarios (nome, email, senha, tipo) VALUES ($1, $2, $3, $4) RETURNING id",
      [nome, email, senha, tipo]
    );
    return rows[0];
  },

  findByEmail: async (email) => {
    const { rows } = await db.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [email]
    );
    return rows[0] || null;
  },

  findById: async (id) => {
    const { rows } = await db.query(
      "SELECT id, nome, email, tipo, criado_em FROM usuarios WHERE id = $1",
      [id]
    );
    return rows[0] || null;
  },
};

module.exports = User;