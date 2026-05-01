const db = require("../config/database");

const Salon = {
  create: async (data) => {
    const { nome, endereco, telefone, horario_abertura, horario_fechamento } = data;
    const [result] = await db.query(
      `INSERT INTO saloes (nome, endereco, telefone, horario_abertura, horario_fechamento)
       VALUES (?, ?, ?, ?, ?)`,
      [nome, endereco, telefone, horario_abertura, horario_fechamento]
    );
    return result;
  },

  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM saloes");
    return rows;
  },

  findById: async (id) => {
    const [rows] = await db.query("SELECT * FROM saloes WHERE id = ?", [id]);
    return rows[0] || null;
  },

  delete: async (id) => {
    const [result] = await db.query("DELETE FROM saloes WHERE id = ?", [id]);
    return result;
  },
};

module.exports = Salon;