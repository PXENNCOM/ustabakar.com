const { DataTypes } = require('sequelize');

module.exports = {
  name: '007_create_requests',
  async up(qi) {
    await qi.createTable('requests', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'customers', key: 'id' },
        onDelete: 'RESTRICT',
      },
      // Hizmet istenen il
      city_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'cities', key: 'id' },
        onDelete: 'RESTRICT',
      },
      package_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'service_packages', key: 'id' },
        onDelete: 'SET NULL',
      },
      // link | manual
      entry_type: { type: DataTypes.STRING(10), allowNull: false },
      listing_url: { type: DataTypes.STRING(1000), allowNull: true },
      // Manuel giriş alanları
      brand: { type: DataTypes.STRING(100), allowNull: true },
      model: { type: DataTypes.STRING(100), allowNull: true },
      year: { type: DataTypes.INTEGER, allowNull: true },
      seller_district_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'districts', key: 'id' },
        onDelete: 'SET NULL',
      },
      seller_name: { type: DataTypes.STRING(200), allowNull: true },
      seller_phone: { type: DataTypes.STRING(20), allowNull: true },
      customer_note: { type: DataTypes.TEXT, allowNull: true },
      // pending_payment | pending_receipt | pending_assignment | assigned | completed | cancelled
      status: { type: DataTypes.STRING(30), defaultValue: 'pending_payment' },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    });

    await qi.createTable('request_photos', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      request_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'requests', key: 'id' },
        onDelete: 'CASCADE',
      },
      url: { type: DataTypes.STRING(500), allowNull: false },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    });
  },
  async down(qi) {
    await qi.dropTable('request_photos');
    await qi.dropTable('requests');
  },
};
