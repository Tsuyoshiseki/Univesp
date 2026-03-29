const Booking = require("../models/Booking");

exports.createBooking = async (req, res) => {
  const { servico_id, profissional_id, data, hora } = req.body;
  const usuario_id = req.user.id; // vem do verifyToken

  if (!servico_id || !profissional_id || !data || !hora) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  try {
    const conflicts = await Booking.checkAvailability(profissional_id, data, hora);

    if (conflicts.length > 0) {
      return res.status(409).json({ error: "Horário indisponível" });
    }

    await Booking.create({ usuario_id, servico_id, profissional_id, data_ag: data, hora });

    res.status(201).json({ message: "Agendamento realizado com sucesso" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar agendamento", details: err.message });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.getAll();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar agendamentos", details: err.message });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.getByUser(req.user.id);
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar agendamentos", details: err.message });
  }
};

exports.cancelBooking = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Booking.cancel(id, req.user.id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Agendamento não encontrado ou não pertence ao usuário" });
    }

    res.json({ message: "Agendamento cancelado" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao cancelar agendamento", details: err.message });
  }
};