CREATE DATABASE univesp;
USE univesp;

CREATE TABLE usuarios (
 id INT AUTO_INCREMENT PRIMARY KEY,
 nome VARCHAR(100),
 email VARCHAR(100) UNIQUE,
 senha VARCHAR(255),
 tipo ENUM('cliente','admin'),
 criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE saloes (
 id INT AUTO_INCREMENT PRIMARY KEY,
 nome VARCHAR(150),
 endereco VARCHAR(255),
 telefone VARCHAR(20),
 horario_abertura TIME,
 horario_fechamento TIME
);

CREATE TABLE servicos (
 id INT AUTO_INCREMENT PRIMARY KEY,
 nome VARCHAR(100),
 preco DECIMAL(10,2),
 duracao INT,
 salao_id INT,
 FOREIGN KEY (salao_id) REFERENCES saloes(id)
);

CREATE TABLE profissionais (
 id INT AUTO_INCREMENT PRIMARY KEY,
 nome VARCHAR(100),
 especialidades TEXT,
 salao_id INT,
 FOREIGN KEY (salao_id) REFERENCES saloes(id)
);

CREATE TABLE agendamentos (
 id INT AUTO_INCREMENT PRIMARY KEY,
 usuario_id INT,
 servico_id INT,
 profissional_id INT,
 data DATE,
 hora TIME,
 status ENUM('confirmado','cancelado'),
 criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

 FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
 FOREIGN KEY (servico_id) REFERENCES servicos(id),
 FOREIGN KEY (profissional_id) REFERENCES profissionais(id)
);