const Salon = require("../models/Salao");

exports.createSalon = async (req, res) => {
  const { nome, endereco, telefone, horario_abertura, horario_fechamento } = req.body;

  if (!nome) {
    return res.status(400).json({ error: "Nome do salão é obrigatório" });
  }

  try {
    await Salon.create({ nome, endereco, telefone, horario_abertura, horario_fechamento });
    res.status(201).json({ message: "Salão criado com sucesso" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar salão", details: err.message });
  }
};

exports.getSalons = async (req, res) => {
  try {
    const salons = await Salon.getAll();
    res.json(salons);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar salões", details: err.message });
  }
};

exports.deleteSalon = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Salon.delete(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Salão não encontrado" });
    }

    res.json({ message: "Salão removido" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao remover salão", details: err.message });
  }
};