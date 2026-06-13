const { DataTypes } = require('sequelize');

module.exports = {
  name: '010_create_report_categories',
  async up(qi) {
    await qi.createTable('report_categories', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING(150), allowNull: false },
      order_index: { type: DataTypes.INTEGER, defaultValue: 0 },
      is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    });

    // package_categories FK'sını şimdi ekle
    await qi.addConstraint('package_categories', {
      fields: ['category_id'],
      type: 'foreign key',
      name: 'fk_package_categories_category_id',
      references: { table: 'report_categories', field: 'id' },
      onDelete: 'CASCADE',
    });
  },
  async down(qi) {
    await qi.removeConstraint('package_categories', 'fk_package_categories_category_id');
    await qi.dropTable('report_categories');
  },
};
