const { DataTypes } = require('sequelize');

module.exports = {
  name: '005_create_masters',
  async up(qi) {
    await qi.createTable('masters', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING(100), allowNull: false },
      surname: { type: DataTypes.STRING(100), allowNull: false },
      tc: { type: DataTypes.STRING(11), allowNull: true },
      phone: { type: DataTypes.STRING(20), allowNull: false, unique: true },
      phone_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
      city_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'cities', key: 'id' },
        onDelete: 'SET NULL',
      },
      district_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'districts', key: 'id' },
        onDelete: 'SET NULL',
      },
      expertise_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'master_expertises', key: 'id' },
        onDelete: 'SET NULL',
      },
      equipment: { type: DataTypes.TEXT, allowNull: true },
      experience: { type: DataTypes.TEXT, allowNull: true },
      reference: { type: DataTypes.TEXT, allowNull: true },
      certificate_url: { type: DataTypes.STRING(500), allowNull: true },
      profile_photo_url: { type: DataTypes.STRING(500), allowNull: true },
      // pending | active | passive | rejected | deleted
      status: { type: DataTypes.STRING(20), defaultValue: 'pending' },
      // admin | app | web
      registered_by: { type: DataTypes.STRING(20), defaultValue: 'app' },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    });
  },
  async down(qi) {
    await qi.dropTable('masters');
  },
};
