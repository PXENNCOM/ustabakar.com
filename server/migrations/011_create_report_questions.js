const { DataTypes } = require('sequelize');

module.exports = {
  name: '011_create_report_questions',
  async up(qi) {
    await qi.createTable('report_questions', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'report_categories', key: 'id' },
        onDelete: 'CASCADE',
      },
      question_text: { type: DataTypes.TEXT, allowNull: false },
      // open | options
      answer_type: { type: DataTypes.STRING(10), allowNull: false, defaultValue: 'open' },
      order_index: { type: DataTypes.INTEGER, defaultValue: 0 },
      is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    });

    await qi.createTable('question_options', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      question_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'report_questions', key: 'id' },
        onDelete: 'CASCADE',
      },
      option_text: { type: DataTypes.STRING(200), allowNull: false },
      order_index: { type: DataTypes.INTEGER, defaultValue: 0 },
    });
  },
  async down(qi) {
    await qi.dropTable('question_options');
    await qi.dropTable('report_questions');
  },
};
