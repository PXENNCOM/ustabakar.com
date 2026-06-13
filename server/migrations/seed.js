const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    await sequelize.authenticate();
    const qi = sequelize.getQueryInterface();

    // Admin
    const hash = await bcrypt.hash('admin123', 10);
    await sequelize.query(
      `INSERT IGNORE INTO admins (name, email, password_hash, created_at, updated_at)
       VALUES ('Super Admin', 'admin@usta.com', '${hash}', NOW(), NOW())`
    );

    // İller (81 il - kısaltılmış örnek, tam liste eklenebilir)
    const cities = [
      'Adana','Adıyaman','Afyonkarahisar','Ağrı','Amasya','Ankara','Antalya','Artvin',
      'Aydın','Balıkesir','Bilecik','Bingöl','Bitlis','Bolu','Burdur','Bursa','Çanakkale',
      'Çankırı','Çorum','Denizli','Diyarbakır','Edirne','Elazığ','Erzincan','Erzurum',
      'Eskişehir','Gaziantep','Giresun','Gümüşhane','Hakkari','Hatay','Isparta','Mersin',
      'İstanbul','İzmir','Kars','Kastamonu','Kayseri','Kırklareli','Kırşehir','Kocaeli',
      'Konya','Kütahya','Malatya','Manisa','Kahramanmaraş','Mardin','Muğla','Muş',
      'Nevşehir','Niğde','Ordu','Rize','Sakarya','Samsun','Siirt','Sinop','Sivas',
      'Tekirdağ','Tokat','Trabzon','Tunceli','Şanlıurfa','Uşak','Van','Yozgat',
      'Zonguldak','Aksaray','Bayburt','Karaman','Kırıkkale','Batman','Şırnak','Bartın',
      'Ardahan','Iğdır','Yalova','Karabük','Kilis','Osmaniye','Düzce'
    ];

    for (const name of cities) {
      await sequelize.query(
        `INSERT IGNORE INTO cities (name) VALUES ('${name}')`
      );
    }

    // Uzmanlık alanları
    const expertises = ['Kaportacı', 'Boyacı', 'Mekanikçi', 'Genel Ekspertiz'];
    for (let i = 0; i < expertises.length; i++) {
      await sequelize.query(
        `INSERT IGNORE INTO master_expertises (name, is_active, order_index)
         VALUES ('${expertises[i]}', 1, ${i})`
      );
    }

    // Rapor kategorileri
    const categories = [
      'Airbag Ekspertiz',
      'Araç İç/Dış Ekspertiz',
      'Motor Ekspertiz',
      'Mekanik Ekspertiz',
      'Kaporta & Boya Kontrolü',
      'OBD Arıza Tespit',
    ];
    for (let i = 0; i < categories.length; i++) {
      await sequelize.query(
        `INSERT IGNORE INTO report_categories (name, order_index, is_active)
         VALUES ('${categories[i]}', ${i}, 1)`
      );
    }

    // Varsayılan servis paketi
    await sequelize.query(
      `INSERT IGNORE INTO service_packages (name, description, price, is_active, order_index, created_at, updated_at)
       VALUES ('Tam Ekspertiz', 'Tüm kategorileri kapsar', 1500.00, 1, 0, NOW(), NOW())`
    );

    // Varsayılan ayarlar
    const settings = [
      ['service_price', '1500.00'],
      ['commission_rate', '20'],
      ['company_iban', 'TR00 0000 0000 0000 0000 0000 00'],
      ['company_account_name', 'Usta Bakar A.Ş.'],
      ['report_min_photos', '50'],
      ['report_max_photos', '70'],
    ];
    for (const [key, value] of settings) {
      await sequelize.query(
        `INSERT IGNORE INTO settings (\`key\`, value, updated_at)
         VALUES ('${key}', '${value}', NOW())`
      );
    }

    console.log('Seed tamamlandı.');
    process.exit(0);
  } catch (err) {
    console.error('Seed hatası:', err);
    process.exit(1);
  }
}

seed();
