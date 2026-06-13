const { Assignment, Request, Customer, City, District, RequestPhoto, Report, Master, ServicePackage } = require('../../models');
const { success, error } = require('../../utils/response');
const { paginate, paginatedResponse } = require('../../utils/pagination');
const generateReportPdf = require('../../utils/pdf');


exports.active = async (req, res, next) => {
  try {
    const assignment = await Assignment.findOne({
      where: { master_id: req.user.id, status: 'active' },
      include: [
        {
          model: Request,
          include: [
            { model: Customer, attributes: ['id', 'name', 'surname', 'phone'] },
            { model: City, attributes: ['id', 'name'] },
            { model: RequestPhoto, as: 'photos' },
          ],
        },
      ],
    });
    success(res, assignment);
  } catch (err) { next(err); }
};

exports.history = async (req, res, next) => {
  try {
    const { limit, offset, page } = paginate(req.query);
    const { count, rows } = await Assignment.findAndCountAll({
      where: { master_id: req.user.id, status: 'completed' },
      include: [{ model: Request, include: [{ model: City, attributes: ['id', 'name'] }] }],
      order: [['completed_at', 'DESC']],
      limit, offset,
    });
    success(res, paginatedResponse(rows, count, page, limit));
  } catch (err) { next(err); }
};

exports.detail = async (req, res, next) => {
  try {
    const assignment = await Assignment.findOne({
      where: { id: req.params.id, master_id: req.user.id },
      include: [
        {
          model: Request,
          include: [
            { model: Customer, attributes: ['id', 'name', 'surname', 'phone'] },
            { model: City, attributes: ['id', 'name'] },
            { model: RequestPhoto, as: 'photos' },
            { model: ServicePackage, as: 'package' },
          ],
        },
        { model: Report },
      ],
    });
    if (!assignment) return error(res, 'Görev bulunamadı', 404);
    success(res, assignment);
  } catch (err) { next(err); }
};

exports.generatePdf = async (req, res, next) => {
  try {
    const { Report } = require('../../models');
    const assignment = await Assignment.findOne({
      where: { id: req.params.id, master_id: req.user.id },
      include: [{ model: Report }],
    });
    if (!assignment?.Report) return error(res, 'Rapor bulunamadı', 404);
    const pdf = await generateReportPdf(assignment.Report.id);
    if (!pdf) return error(res, 'PDF oluşturulamadı', 500);
    
    const buffer = Buffer.from(pdf);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="rapor-${assignment.Report.id}.pdf"`);
    res.setHeader('Content-Length', buffer.length);
    res.end(buffer, 'binary');
  } catch (err) { next(err); }
};