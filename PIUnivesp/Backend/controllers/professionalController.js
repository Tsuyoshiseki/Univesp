const Professional = require("../models/Professional");

exports.createProfessional = async (req, res) => {
  const { nome, especialidades, salao_id } = req.body;

  if (!nome || !salao_id) {
    return res.status(400).json({ error: "Nome e salao_id são obrigatórios" });
  }

  try {
    await Professional.create({ nome, especialidades, salao_id });
    res.status(201).json({ message: "Profissional criado" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar profissional", details: err.message });
  }
};

exports.getProfessionals = async (req, res) => {
  const { salao_id } = req.query;

  try {
    const professionals = await Professional.getAll(salao_id);
    res.json(professionals);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar profissionais", details: err.message });
  }
};

exports.deleteProfessional = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Professional.delete(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Profissional não encontrado" });
    }

    res.json({ message: "Profissional removido" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao remover profissional", details: err.message });
  }
};