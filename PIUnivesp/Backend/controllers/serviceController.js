const Service = require("../models/Service");

exports.createService = async (req, res) => {
  const { nome, preco, duracao, salao_id } = req.body;

  if (!nome || !preco || !duracao || !salao_id) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  try {
    await Service.create({ nome, preco, duracao, salao_id });
    res.status(201).json({ message: "Serviço criado com sucesso" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar serviço", details: err.message });
  }
};

exports.getServices = async (req, res) => {
  const { salao_id } = req.query;

  try {
    const services = await Service.getAll(salao_id);
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar serviços", details: err.message });
  }
};

exports.deleteService = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Service.delete(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Serviço não encontrado" });
    }

    res.json({ message: "Serviço removido" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao remover serviço", details: err.message });
  }
};