const { DataTypes } = require('sequelize');

module.exports = {
  name: '004_create_customers',
  async up(qi) {
    await qi.createTable('customers', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING(100), allowNull: false },
      surname: { type: DataTypes.STRING(100), allowNull: false },
      phone: { type: DataTypes.STRING(20), allowNull: false, unique: true },
      phone_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
      city_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'cities', key: 'id' },
        onDelete: 'SET NULL',
      },
      // active | passive
      status: { type: DataTypes.STRING(20), defaultValue: 'active' },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    });
  },
  async down(qi) {
    await qi.dropTable('customers');
  },
};
