const { DataTypes } = require('sequelize');

const TABLE_OPTIONS = { charset: 'utf8mb4', collate: 'utf8mb4_turkish_ci' };

module.exports = {
  name: '020_create_semts_neighborhoods',
  async up(qi) {
    // il (cities) > ilçe (districts) > semt (semts) > mahalle (neighborhoods)
    await qi.createTable('semts', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      district_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'districts', key: 'id' },
        onDelete: 'CASCADE',
      },
      name: { type: DataTypes.STRING(100), allowNull: false },
    }, TABLE_OPTIONS);

    await qi.createTable('neighborhoods', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      semt_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'semts', key: 'id' },
        onDelete: 'CASCADE',
      },
      // Hızlı sorgu için ilçe de tutuluyor (semt üzerinden de bulunabilir)
      district_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'districts', key: 'id' },
        onDelete: 'CASCADE',
      },
      name: { type: DataTypes.STRING(150), allowNull: false },
      postal_code: { type: DataTypes.STRING(5), allowNull: true },
    }, TABLE_OPTIONS);
  },
  async down(qi) {
    await qi.dropTable('neighborhoods');
    await qi.dropTable('semts');
  },
};