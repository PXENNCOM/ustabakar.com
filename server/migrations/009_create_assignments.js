const { DataTypes } = require('sequelize');

module.exports = {
  name: '009_create_assignments',
  async up(qi) {
    await qi.createTable('assignments', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      request_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'requests', key: 'id' },
        onDelete: 'RESTRICT',
      },
      master_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'masters', key: 'id' },
        onDelete: 'RESTRICT',
      },
      assigned_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'admins', key: 'id' },
        onDelete: 'SET NULL',
      },
      // active | completed | cancelled
      status: { type: DataTypes.STRING(20), defaultValue: 'active' },
      cancelled_reason: { type: DataTypes.TEXT, allowNull: true },
      assigned_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      completed_at: { type: DataTypes.DATE, allowNull: true },
    });
  },
  async down(qi) {
    await qi.dropTable('assignments');
  },
};
