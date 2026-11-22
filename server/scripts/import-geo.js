// Türkiye ilçe / semt / mahalle verisini içeri aktarır (data/tr-geo.json.gz).
// İller mevcut "cities" tablosuyla İSİMDEN eşleştirilir; ilçe, semt ve mahalle tabloları doldurulur.
// - Eşleşmeyen il varsa hiçbir şey yazmadan çıkar.
// - Tablolar zaten doluysa hiçbir şey yapmaz (iki kez çalıştırmak güvenlidir).
// - Her şey tek transaction içinde yazılır; hata olursa hiçbir kayıt kalmaz.
// Kullanım: node scripts/import-geo.js
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const sequelize = require('../config/database');

const CHUNK = 2000;
const ALIASES = {
  afyon: 'afyonkarahisar',
  'k.maraş': 'kahramanmaraş',
  maraş: 'kahramanmaraş',
  urfa: 'şanlıurfa',
  antep: 'gaziantep',
  içel: 'mersin',
};

const lower = (s) => String(s).trim().replace(/\s+/g, ' ').toLocaleLowerCase('tr-TR');
const ascii = (s) => lower(s).replace(/ı/g, 'i').normalize('NFD').replace(/[\u0300-\u036f]/g, '');

async function insertChunks(table, columns, rows, transaction) {
  for (let i = 0; i < rows.length; i += CHUNK) {
    const part = rows.slice(i, i + CHUNK);
    const placeholders = part.map(() => `(${columns.map(() => '?').join(',')})`).join(',');
    await sequelize.query(
      `INSERT INTO ${table} (${columns.join(',')}) VALUES ${placeholders}`,
      { replacements: part.flat(), transaction }
    );
    process.stdout.write(`\r  ${table}: ${Math.min(i + CHUNK, rows.length)} / ${rows.length}`);
  }
  process.stdout.write('\n');
}

(async () => {
  const file = path.join(__dirname, '..', 'data', 'tr-geo.json.gz');
  const geo = JSON.parse(zlib.gunzipSync(fs.readFileSync(file)).toString('utf8'));
  console.log(`Kaynak: ${geo.source}`);

  // Tablolar dolu mu?
  for (const t of ['districts', 'semts', 'neighborhoods']) {
    let n;
    try {
      [[{ n }]] = await sequelize.query(`SELECT COUNT(*) AS n FROM ${t}`);
    } catch (e) {
      if (e.original?.code === 'ER_NO_SUCH_TABLE') {
        console.error(`"${t}" tablosu yok. Önce: node scripts/run-migration.js 020_create_semts_neighborhoods`);
        process.exit(1);
      }
      throw e;
    }
    if (Number(n) > 0) {
      console.log(`"${t}" tablosunda zaten ${n} kayıt var, içe aktarma daha önce yapılmış. Hiçbir şey değiştirilmedi.`);
      process.exit(0);
    }
  }

  // İlleri isimden eşleştir
  const [dbCities] = await sequelize.query('SELECT id, name FROM cities');
  const byName = new Map();
  for (const c of dbCities) {
    const key = ALIASES[lower(c.name)] || lower(c.name);
    byName.set(key, c.id);
    byName.set(ascii(key), c.id);
  }
  const cityMap = new Map();
  const missing = [];
  for (const [srcId, name] of geo.cities) {
    const id = byName.get(lower(name)) ?? byName.get(ascii(name));
    if (id) cityMap.set(srcId, id);
    else missing.push(name);
  }
  if (missing.length) {
    console.error(`Veritabanındaki illerle eşleşmeyen iller: ${missing.join(', ')}`);
    console.error('Hiçbir şey yazılmadı.');
    process.exit(1);
  }
  console.log(`81 ilin tamamı eşleşti.`);

  const semtDistrict = new Map(geo.semts.map(([id, countyId]) => [id, countyId]));

  const t = await sequelize.transaction();
  try {
    await insertChunks('districts', ['id', 'city_id', 'name'],
      geo.counties.map(([id, cityId, name]) => [id, cityMap.get(cityId), name]), t);
    await insertChunks('semts', ['id', 'district_id', 'name'], geo.semts, t);
    await insertChunks('neighborhoods', ['id', 'semt_id', 'district_id', 'name', 'postal_code'],
      geo.neighbourhoods.map(([id, semtId, name, pk]) => [id, semtId, semtDistrict.get(semtId), name, pk || null]), t);
    await t.commit();
  } catch (e) {
    await t.rollback();
    throw e;
  }

  console.log('✓ İçe aktarma tamamlandı.');
  process.exit(0);
})().catch((e) => { console.error('Hata:', e.message); process.exit(1); });