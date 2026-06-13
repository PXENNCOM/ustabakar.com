const { DataTypes } = require('sequelize');

module.exports = {
  name: '006_create_service_packages',
  async up(qi) {
    await qi.createTable('service_packages', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING(150), allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
      order_index: { type: DataTypes.INTEGER, defaultValue: 0 },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    });

    // Hangi pakette hangi rapor kategorileri var
    await qi.createTable('package_categories', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      package_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'service_packages', key: 'id' },
        onDelete: 'CASCADE',
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // report_categories henüz yok, FK sonradan eklenecek
      },
    });
  },
  async down(qi) {
    await qi.dropTable('package_categories');
    await qi.dropTable('service_packages');
  },
};
