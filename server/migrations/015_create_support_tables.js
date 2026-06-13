const { DataTypes } = require('sequelize');

module.exports = {
  name: '015_create_support_tables',
  async up(qi) {
    await qi.createTable('notifications', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      receiver_id: { type: DataTypes.INTEGER, allowNull: false },
      receiver_type: { type: DataTypes.STRING(20), allowNull: false },
      title: { type: DataTypes.STRING(200), allowNull: false },
      body: { type: DataTypes.TEXT, allowNull: false },
      is_read: { type: DataTypes.BOOLEAN, defaultValue: false },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    });

    await qi.createTable('sms_logs', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      phone: { type: DataTypes.STRING(20), allowNull: false },
      message: { type: DataTypes.TEXT, allowNull: false },
      // sent | failed
      status: { type: DataTypes.STRING(20), defaultValue: 'sent' },
      sent_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    });

    await qi.createTable('settings', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      key: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      value: { type: DataTypes.TEXT, allowNull: true },
      updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    });
  },
  async down(qi) {
    await qi.dropTable('settings');
    await qi.dropTable('sms_logs');
    await qi.dropTable('notifications');
  },
};
