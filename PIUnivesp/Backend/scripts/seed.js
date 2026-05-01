// scripts/seed.js — PostgreSQL/Supabase
require('dotenv').config();
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

async function seed() {
  const db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  console.log('Seeding database...');

  const adminHash  = await bcrypt.hash('admin123',   10);
  const clientHash = await bcrypt.hash('cliente123', 10);

  await db.query(
    `INSERT INTO usuarios (nome, email, senha, tipo)
     VALUES ($1, $2, $3, 'admin')
     ON CONFLICT (email) DO UPDATE SET senha = EXCLUDED.senha, tipo = 'admin'`,
    ['Administrador', 'admin@salon.com', adminHash]
  );

  await db.query(
    `INSERT INTO usuarios (nome, email, senha, tipo)
     VALUES ($1, $2, $3, 'cliente')
     ON CONFLICT (email) DO UPDATE SET senha = EXCLUDED.senha`,
    ['João Cliente', 'cliente@salon.com', clientHash]
  );

  await db.query(
    `INSERT INTO saloes (nome, endereco, telefone, horario_abertura, horario_fechamento)
     VALUES ('Salão Principal', 'Rua Principal, 1', '(11) 99999-0000', '08:00:00', '18:00:00')
     ON CONFLICT DO NOTHING`
  );

  console.log('Seed completo!');
  console.log('  Admin  → admin@salon.com  / admin123');
  console.log('  Client → cliente@salon.com / cliente123');
  console.log('  Salão  → id=1 criado');

  await db.end();
}

seed().catch(err => {
  console.error('Seed falhou:', err);
  process.exit(1);
});