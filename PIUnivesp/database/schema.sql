CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  senha VARCHAR(255),
  tipo VARCHAR(10) CHECK (tipo IN ('cliente','admin')),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE saloes (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(150),
  endereco VARCHAR(255),
  telefone VARCHAR(20),
  horario_abertura TIME,
  horario_fechamento TIME
);

CREATE TABLE servicos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100),
  preco DECIMAL(10,2),
  duracao INT,
  salao_id INT REFERENCES saloes(id)
);

CREATE TABLE profissionais (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100),
  especialidades TEXT,
  salao_id INT REFERENCES saloes(id)
);

CREATE TABLE agendamentos (
  id SERIAL PRIMARY KEY,
  usuario_id INT REFERENCES usuarios(id),
  servico_id INT REFERENCES servicos(id),
  profissional_id INT REFERENCES profissionais(id),
  data DATE,
  hora TIME,
  status VARCHAR(20) DEFAULT 'confirmado',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);