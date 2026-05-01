const db = require("../config/database");

const Service = {
  create: async (data) => {
    const { nome, preco, duracao, salao_id } = data;
    const { rows } = await db.query(
      "INSERT INTO servicos (nome, preco, duracao, salao_id) VALUES ($1, $2, $3, $4) RETURNING id",
      [nome, preco, duracao, salao_id]
    );
    return rows[0];
  },

  getAll: async (salao_id) => {
    if (salao_id) {
      const { rows } = await db.query(
        "SELECT * FROM servicos WHERE salao_id = $1 ORDER BY nome",
        [salao_id]
      );
      return rows;
    }
    const { rows } = await db.query("SELECT * FROM servicos ORDER BY nome");
    return rows;
  },

  findById: async (id) => {
    const { rows } = await db.query(
      "SELECT * FROM servicos WHERE id = $1",
      [id]
    );
    return rows[0] || null;
  },

  delete: async (id) => {
    const { rowCount } = await db.query(
      "DELETE FROM servicos WHERE id = $1",
      [id]
    );
    return { affectedRows: rowCount };
  },
};

module.exports = Service;