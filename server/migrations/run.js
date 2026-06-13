const sequelize = require('../config/database');

const migrations = [
  require('./001_create_admins'),
  require('./002_create_cities_districts'),
  require('./003_create_master_expertises'),
  require('./004_create_customers'),
  require('./005_create_masters'),
  require('./006_create_service_packages'),
  require('./007_create_requests'),
  require('./008_create_payments'),
  require('./009_create_assignments'),
  require('./010_create_report_categories'),
  require('./011_create_report_questions'),
  require('./012_create_reports'),
  require('./013_create_earnings'),
  require('./014_create_tickets'),
  require('./015_create_support_tables'),
  require('./018_add_vehicle_ids_to_requests'),
];

async function run() {
  try {
    await sequelize.authenticate();
    console.log('DB bağlantısı başarılı.');

    const qi = sequelize.getQueryInterface();

    for (const migration of migrations) {
      await migration.up(qi, sequelize);
      console.log(`✓ ${migration.name || 'migration'} tamamlandı`);
    }

    console.log('\nTüm migrationlar başarıyla çalıştırıldı.');
    process.exit(0);
  } catch (err) {
    console.error('Migration hatası:', err);
    process.exit(1);
  }
}

run();