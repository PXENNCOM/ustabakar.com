const { DataTypes } = require('sequelize');

module.exports = {
  name: '013_create_earnings',
  async up(qi) {
    await qi.createTable('earnings', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      master_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'masters', key: 'id' },
        onDelete: 'RESTRICT',
      },
      assignment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: { model: 'assignments', key: 'id' },
        onDelete: 'RESTRICT',
      },
      // Müşterinin ödediği tutar
      gross_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      // Komisyon oranı (örn: 20.00 = %20)
      commission_rate: { type: DataTypes.DECIMAL(5, 2), allowNull: false },
      // Kesilen komisyon tutarı
      commission_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      // Ustaya ödenecek net tutar
      net_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      // pending | paid
      status: { type: DataTypes.STRING(20), defaultValue: 'pending' },
      paid_at: { type: DataTypes.DATE, allowNull: true },
      paid_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'admins', key: 'id' },
        onDelete: 'SET NULL',
      },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    });
  },
  async down(qi) {
    await qi.dropTable('earnings');
  },
};
