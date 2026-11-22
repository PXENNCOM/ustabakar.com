// Tek bir migration'ı çalıştırır.
// Kullanım: node scripts/run-migration.js 020_create_semts_neighborhoods
const path = require('path');
const sequelize = require('../config/database');

const name = (process.argv[2] || '').replace(/\.js$/, '');
if (!name) {
  console.error('Migration adı verin, örn: node scripts/run-migration.js 020_create_semts_neighborhoods');
  process.exit(1);
}

const migration = require(path.join(__dirname, '..', 'migrations', name));

migration.up(sequelize.getQueryInterface())
  .then(() => { console.log(`✓ ${migration.name || name} tamamlandı`); process.exit(0); })
  .catch((e) => { console.error('Migration hatası:', e.message); process.exit(1); });