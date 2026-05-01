const db = require("../config/database");

const Booking = {
  create: async (data) => {
    const { usuario_id, servico_id, profissional_id, data_ag, hora } = data;
    const { rows } = await db.query(
      `INSERT INTO agendamentos (usuario_id, servico_id, profissional_id, data, hora, status)
       VALUES ($1, $2, $3, $4, $5, 'confirmado') RETURNING id`,
      [usuario_id, servico_id, profissional_id, data_ag, hora]
    );
    return rows[0];
  },

  getAll: async () => {
    const { rows } = await db.query(
      `SELECT a.*, s.nome AS servico, p.nome AS profissional, u.nome AS usuario_nome
       FROM agendamentos a
       JOIN servicos s      ON a.servico_id      = s.id
       JOIN profissionais p ON a.profissional_id = p.id
       JOIN usuarios u      ON a.usuario_id      = u.id
       ORDER BY a.data DESC, a.hora DESC`
    );
    return rows;
  },

  getByUser: async (usuario_id) => {
    const { rows } = await db.query(
      `SELECT a.*, s.nome AS servico, p.nome AS profissional
       FROM agendamentos a
       JOIN servicos s      ON a.servico_id      = s.id
       JOIN profissionais p ON a.profissional_id = p.id
       WHERE a.usuario_id = $1
       ORDER BY a.data DESC, a.hora DESC`,
      [usuario_id]
    );
    return rows;
  },

  checkAvailability: async (profissional_id, data, hora) => {
    const { rows } = await db.query(
      `SELECT id FROM agendamentos
       WHERE profissional_id = $1 AND data = $2 AND hora = $3 AND status = 'confirmado'`,
      [profissional_id, data, hora]
    );
    return rows;
  },

  cancel: async (id, usuario_id) => {
    const { rowCount } = await db.query(
      `UPDATE agendamentos SET status = 'cancelado'
       WHERE id = $1 AND usuario_id = $2`,
      [id, usuario_id]
    );
    return { affectedRows: rowCount };
  },

  updateStatus: async (id, status) => {
    const { rowCount } = await db.query(
      `UPDATE agendamentos SET status = $1 WHERE id = $2`,
      [status, id]
    );
    return { affectedRows: rowCount };
  },
};

module.exports = Booking;