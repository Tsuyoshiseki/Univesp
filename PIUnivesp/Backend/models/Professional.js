const db = require("../config/database");

const Professional = {
  create: async (data) => {
    const { nome, especialidades, salao_id } = data;
    const [result] = await db.query(
      "INSERT INTO profissionais (nome, especialidades, salao_id) VALUES (?, ?, ?)",
      [nome, especialidades, salao_id]
    );
    return result;
  },

  getAll: async (salao_id) => {
    if (salao_id) {
      const [rows] = await db.query(
        "SELECT * FROM profissionais WHERE salao_id = ?",
        [salao_id]
      );
      return rows;
    }
    const [rows] = await db.query("SELECT * FROM profissionais");
    return rows;
  },

  findById: async (id) => {
    const [rows] = await db.query(
      "SELECT * FROM profissionais WHERE id = ?",
      [id]
    );
    return rows[0] || null;
  },

  delete: async (id) => {
    const [result] = await db.query(
      "DELETE FROM profissionais WHERE id = ?",
      [id]
    );
    return result;
  },
};

module.exports = Professional;