// scripts/seed.js
require('dotenv').config({ path: '../.env' });
const bcrypt = require('bcrypt');
const mysql  = require('mysql2/promise');

async function seed() {
  const db = await mysql.createConnection({
    host:     process.env.DB_HOST     || 'localhost',
    user:     process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME     || 'univesp',
  });

  console.log('Seeding database...');

  const adminHash  = await bcrypt.hash('admin123',   10);
  const clientHash = await bcrypt.hash('cliente123', 10);

  await db.execute(
    `INSERT INTO usuarios (nome, email, senha, tipo)
     VALUES (?, ?, ?, 'admin')
     ON DUPLICATE KEY UPDATE senha = VALUES(senha), tipo = 'admin'`,
    ['Administrador', 'admin@salon.com', adminHash]
  );

  await db.execute(
    `INSERT INTO usuarios (nome, email, senha, tipo)
     VALUES (?, ?, ?, 'cliente')
     ON DUPLICATE KEY UPDATE senha = VALUES(senha)`,
    ['João Cliente', 'cliente@salon.com', clientHash]
  );

  // Salão padrão (necessário para criar serviços)
  await db.execute(
    `INSERT INTO saloes (id, nome, endereco, telefone, horario_abertura, horario_fechamento)
     VALUES (1, 'Salão Principal', 'Rua Principal, 1', '(11) 99999-0000', '08:00:00', '18:00:00')
     ON DUPLICATE KEY UPDATE nome = VALUES(nome)`,
  );

  console.log('Seed completo!');
  console.log('  Admin  → admin@salon.com  / admin123');
  console.log('  Client → cliente@salon.com / cliente123');
  console.log('  Salão  → id=1 criado');

  await db.end();
}

seed().catch(err => {
  console.error('Seed falhou:', err.message);
  process.exit(1);
});