const { DataTypes } = require('sequelize');

module.exports = {
  name: '001_create_admins',
  async up(qi) {
    await qi.createTable('admins', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING(100), allowNull: false },
      email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
      password_hash: { type: DataTypes.STRING(255), allowNull: false },
      failed_login_attempts: { type: DataTypes.INTEGER, defaultValue: 0 },
      locked_until: { type: DataTypes.DATE, allowNull: true },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    });
  },
  async down(qi) {
    await qi.dropTable('admins');
  },
};
