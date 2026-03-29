const db = require("../config/database");

const Booking = {
  create: async (data) => {
    const { usuario_id, servico_id, profissional_id, data_ag, hora } = data;
    const [result] = await db.query(
      `INSERT INTO agendamentos (usuario_id, servico_id, profissional_id, data, hora, status)
       VALUES (?, ?, ?, ?, ?, 'confirmado')`,
      [usuario_id, servico_id, profissional_id, data_ag, hora]
    );
    return result;
  },

  getAll: async () => {
    const [rows] = await db.query(
      `SELECT a.*, s.nome AS servico, p.nome AS profissional
       FROM agendamentos a
       JOIN servicos s ON a.servico_id = s.id
       JOIN profissionais p ON a.profissional_id = p.id`
    );
    return rows;
  },

  getByUser: async (usuario_id) => {
    const [rows] = await db.query(
      `SELECT a.*, s.nome AS servico, p.nome AS profissional
       FROM agendamentos a
       JOIN servicos s ON a.servico_id = s.id
       JOIN profissionais p ON a.profissional_id = p.id
       WHERE a.usuario_id = ?
       ORDER BY a.data DESC, a.hora DESC`,
      [usuario_id]
    );
    return rows;
  },

  checkAvailability: async (profissional_id, data, hora) => {
    const [rows] = await db.query(
      `SELECT id FROM agendamentos
       WHERE profissional_id = ? AND data = ? AND hora = ? AND status = 'confirmado'`,
      [profissional_id, data, hora]
    );
    return rows;
  },

  cancel: async (id, usuario_id) => {
    const [result] = await db.query(
      `UPDATE agendamentos SET status = 'cancelado'
       WHERE id = ? AND usuario_id = ?`,
      [id, usuario_id]
    );
    return result;
  },
};

module.exports = Booking;