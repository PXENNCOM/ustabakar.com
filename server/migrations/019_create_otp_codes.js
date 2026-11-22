const { DataTypes } = require('sequelize');

module.exports = {
  name: '019_create_otp_codes',
  async up(qi) {
    await qi.createTable('otp_codes', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      phone: { type: DataTypes.STRING(20), allowNull: false },
      // customer_login | customer_register | master_login | master_register
      purpose: { type: DataTypes.STRING(30), allowNull: false },
      code_hash: { type: DataTypes.STRING(64), allowNull: false },
      attempts: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      expires_at: { type: DataTypes.DATE, allowNull: false },
      consumed_at: { type: DataTypes.DATE, allowNull: true },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    });
    await qi.addIndex('otp_codes', ['phone', 'created_at']);
  },
  async down(qi) {
    await qi.dropTable('otp_codes');
  },
};