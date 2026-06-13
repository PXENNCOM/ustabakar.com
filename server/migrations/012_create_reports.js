const { DataTypes } = require('sequelize');

module.exports = {
  name: '012_create_reports',
  async up(qi) {
    await qi.createTable('reports', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      assignment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: { model: 'assignments', key: 'id' },
        onDelete: 'RESTRICT',
      },
      // Araç tescil bilgileri
      plate: { type: DataTypes.STRING(20), allowNull: false },
      chassis_no: { type: DataTypes.STRING(50), allowNull: true },
      brand: { type: DataTypes.STRING(100), allowNull: true },
      model: { type: DataTypes.STRING(100), allowNull: true },
      year: { type: DataTypes.INTEGER, allowNull: true },
      color: { type: DataTypes.STRING(50), allowNull: true },
      // manuel | otomatik | yarı otomatik
      transmission: { type: DataTypes.STRING(50), allowNull: true },
      engine_cc: { type: DataTypes.INTEGER, allowNull: true },
      km: { type: DataTypes.INTEGER, allowNull: true },
      master_note: { type: DataTypes.TEXT, allowNull: true },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    });

    await qi.createTable('report_answers', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      report_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'reports', key: 'id' },
        onDelete: 'CASCADE',
      },
      question_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'report_questions', key: 'id' },
        onDelete: 'RESTRICT',
      },
      // Seçenekli cevap (opsiyonel)
      selected_option_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'question_options', key: 'id' },
        onDelete: 'SET NULL',
      },
      // Açık uçlu cevap (opsiyonel)
      open_text: { type: DataTypes.TEXT, allowNull: true },
    });

    await qi.createTable('report_photos', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      report_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'reports', key: 'id' },
        onDelete: 'CASCADE',
      },
      url: { type: DataTypes.STRING(500), allowNull: false },
      order_index: { type: DataTypes.INTEGER, defaultValue: 0 },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    });
  },
  async down(qi) {
    await qi.dropTable('report_photos');
    await qi.dropTable('report_answers');
    await qi.dropTable('reports');
  },
};
