const db = require("../config/database");

const Service = {
  create: async (data) => {
    const { nome, preco, duracao, salao_id } = data;
    const [result] = await db.query(
      "INSERT INTO servicos (nome, preco, duracao, salao_id) VALUES (?, ?, ?, ?)",
      [nome, preco, duracao, salao_id]
    );
    return result;
  },

  getAll: async (salao_id) => {
    if (salao_id) {
      const [rows] = await db.query(
        "SELECT * FROM servicos WHERE salao_id = ?",
        [salao_id]
      );
      return rows;
    }
    const [rows] = await db.query("SELECT * FROM servicos");
    return rows;
  },

  findById: async (id) => {
    const [rows] = await db.query("SELECT * FROM servicos WHERE id = ?", [id]);
    return rows[0] || null;
  },

  delete: async (id) => {
    const [result] = await db.query("DELETE FROM servicos WHERE id = ?", [id]);
    return result;
  },
};

module.exports = Service;