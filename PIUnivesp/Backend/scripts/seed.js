// ============================================================
// scripts/seed.js
// Run once to create the admin user with a real bcrypt hash
// Usage: node scripts/seed.js
// ============================================================

require('dotenv').config({ path: '../.env' });
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

async function seed() {
    const db = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'univesp',
    });

    console.log('Seeding database...');

    // Create hashed password for admin
    const adminHash = await bcrypt.hash('admin123', 10);
    const clientHash = await bcrypt.hash('cliente123', 10);

    // Upsert admin
    await db.execute(
        `INSERT INTO usuarios (nome, email, senha, papel, telefone)
         VALUES (?, ?, ?, 'admin', ?)
         ON DUPLICATE KEY UPDATE senha = VALUES(senha)`,
        ['Administrador', 'admin@salon.com', adminHash, '(11) 99999-0000']
    );

    // Upsert sample client
    await db.execute(
        `INSERT INTO usuarios (nome, email, senha, papel, telefone)
         VALUES (?, ?, ?, 'cliente', ?)
         ON DUPLICATE KEY UPDATE senha = VALUES(senha)`,
        ['João Cliente', 'cliente@salon.com', clientHash, '(11) 98888-1234']
    );

    console.log('Seed complete!');
    console.log('   Admin  → admin@salon.com  / admin123');
    console.log('   Client → cliente@salon.com / cliente123');

    await db.end();
}

seed().catch(err => {
    console.error('Seed failed:', err.message);
    process.exit(1);
});