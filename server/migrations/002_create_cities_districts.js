const { DataTypes } = require('sequelize');

module.exports = {
  name: '002_create_cities_districts',
  async up(qi) {
    await qi.createTable('cities', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING(100), allowNull: false },
    });

    await qi.createTable('districts', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      city_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'cities', key: 'id' },
        onDelete: 'CASCADE',
      },
      name: { type: DataTypes.STRING(100), allowNull: false },
    });
  },
  async down(qi) {
    await qi.dropTable('districts');
    await qi.dropTable('cities');
  },
};
