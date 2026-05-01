const db = require("../config/database");

const Salon = {
  create: async (data) => {
    const { nome, endereco, telefone, horario_abertura, horario_fechamento } = data;
    const { rows } = await db.query(
      `INSERT INTO saloes (nome, endereco, telefone, horario_abertura, horario_fechamento)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [nome, endereco, telefone, horario_abertura, horario_fechamento]
    );
    return rows[0];
  },

  getAll: async () => {
    const { rows } = await db.query("SELECT * FROM saloes ORDER BY nome");
    return rows;
  },

  findById: async (id) => {
    const { rows } = await db.query(
      "SELECT * FROM saloes WHERE id = $1",
      [id]
    );
    return rows[0] || null;
  },

  delete: async (id) => {
    const { rowCount } = await db.query(
      "DELETE FROM saloes WHERE id = $1",
      [id]
    );
    return { affectedRows: rowCount };
  },
};

module.exports = Salon;