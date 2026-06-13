const { DataTypes } = require('sequelize');

module.exports = {
  name: '008_create_payments',
  async up(qi) {
    await qi.createTable('payments', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      request_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: { model: 'requests', key: 'id' },
        onDelete: 'RESTRICT',
      },
      amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      // card | bank_transfer
      method: { type: DataTypes.STRING(20), allowNull: false },
      // pending | pending_receipt | approved | rejected
      status: { type: DataTypes.STRING(20), defaultValue: 'pending' },
      receipt_url: { type: DataTypes.STRING(500), allowNull: true },
      // Havale/EFT reddedilme sebebi
      rejection_reason: { type: DataTypes.TEXT, allowNull: true },
      approved_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'admins', key: 'id' },
        onDelete: 'SET NULL',
      },
      paid_at: { type: DataTypes.DATE, allowNull: true },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    });
  },
  async down(qi) {
    await qi.dropTable('payments');
  },
};
