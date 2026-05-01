const db = require("../config/database");

const Professional = {
  create: async (data) => {
    const { nome, especialidades, salao_id } = data;
    const { rows } = await db.query(
      "INSERT INTO profissionais (nome, especialidades, salao_id) VALUES ($1, $2, $3) RETURNING id",
      [nome, especialidades, salao_id]
    );
    return rows[0];
  },

  getAll: async (salao_id) => {
    if (salao_id) {
      const { rows } = await db.query(
        "SELECT * FROM profissionais WHERE salao_id = $1 ORDER BY nome",
        [salao_id]
      );
      return rows;
    }
    const { rows } = await db.query("SELECT * FROM profissionais ORDER BY nome");
    return rows;
  },

  findById: async (id) => {
    const { rows } = await db.query(
      "SELECT * FROM profissionais WHERE id = $1",
      [id]
    );
    return rows[0] || null;
  },

  delete: async (id) => {
    const { rowCount } = await db.query(
      "DELETE FROM profissionais WHERE id = $1",
      [id]
    );
    return { affectedRows: rowCount };
  },
};

module.exports = Professional;