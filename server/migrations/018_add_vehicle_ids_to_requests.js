const { DataTypes } = require('sequelize');

module.exports = {
  name: '018_add_vehicle_ids_to_requests',
  async up(qi) {
    await qi.addColumn('requests', 'brand_id', {
      type: DataTypes.INTEGER,
      allowNull: true,
    });
    await qi.addColumn('requests', 'model_id', {
      type: DataTypes.INTEGER,
      allowNull: true,
    });
    await qi.addColumn('requests', 'year_id', {
      type: DataTypes.INTEGER,
      allowNull: true,
    });
  },
  async down(qi) {
    await qi.removeColumn('requests', 'brand_id');
    await qi.removeColumn('requests', 'model_id');
    await qi.removeColumn('requests', 'year_id');
  },
};