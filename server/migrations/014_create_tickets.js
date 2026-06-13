const { DataTypes } = require('sequelize');

module.exports = {
  name: '014_create_tickets',
  async up(qi) {
    await qi.createTable('tickets', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      sender_id: { type: DataTypes.INTEGER, allowNull: false },
      // customer | master
      sender_type: { type: DataTypes.STRING(20), allowNull: false },
      message: { type: DataTypes.TEXT, allowNull: false },
      admin_note: { type: DataTypes.TEXT, allowNull: true },
      closed_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'admins', key: 'id' },
        onDelete: 'SET NULL',
      },
      // open | closed
      status: { type: DataTypes.STRING(20), defaultValue: 'open' },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      closed_at: { type: DataTypes.DATE, allowNull: true },
    });
  },
  async down(qi) {
    await qi.dropTable('tickets');
  },
};
