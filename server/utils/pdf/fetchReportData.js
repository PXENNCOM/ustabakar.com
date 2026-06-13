const {
  Report, Assignment, Master, Request, Customer, City,
  ReportAnswer, ReportPhoto, ReportQuestion, ReportCategory, QuestionOption,
} = require('../../models');

module.exports = async function fetchReportData(reportId) {
  const report = await Report.findByPk(reportId, {
    include: [
      {
        model: Assignment,
        include: [
          { model: Master, attributes: ['id', 'name', 'surname'] },
          {
            model: Request,
            include: [
              { model: Customer, attributes: ['id', 'name', 'surname', 'phone'] },
              { model: City, attributes: ['id', 'name'] },
            ],
          },
        ],
      },
      {
        model: ReportAnswer, as: 'answers',
        include: [
          {
            model: ReportQuestion, as: 'question',
            include: [{ model: ReportCategory, as: 'category' }],
          },
          { model: QuestionOption, as: 'selected_option' },
        ],
      },
      { model: ReportPhoto, as: 'photos' },
    ],
  });

  return report;
};