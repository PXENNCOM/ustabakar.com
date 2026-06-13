const { DataTypes } = require('sequelize');

module.exports = {
  name: '003_create_master_expertises',
  async up(qi) {
    await qi.createTable('master_expertises', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING(100), allowNull: false },
      is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
      order_index: { type: DataTypes.INTEGER, defaultValue: 0 },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    });
  },
  async down(qi) {
    await qi.dropTable('master_expertises');
  },
};
