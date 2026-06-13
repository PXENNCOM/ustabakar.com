const { Op } = require('sequelize');
const { Report, Assignment, Master, Request, Customer, ReportAnswer, ReportPhoto, ReportQuestion, QuestionOption } = require('../../models');
const { success, error } = require('../../utils/response');
const { paginate, paginatedResponse } = require('../../utils/pagination');
const generateReportPdf = require('../../utils/pdf');


exports.list = async (req, res, next) => {
  try {
    const { limit, offset, page } = paginate(req.query);
    const { search, master_id, city_id, date_from, date_to, customer_search, master_search, brand, model } = req.query;

    const where = {};
    if (search) where[Op.or] = [
      { plate: { [Op.like]: `%${search}%` } },
      { chassis_no: { [Op.like]: `%${search}%` } },
    ];
    if (brand) where.brand = { [Op.like]: `%${brand}%` };
    if (model) where.model = { [Op.like]: `%${model}%` };

    if (date_from || date_to) {
      where.created_at = {};
      if (date_from) where.created_at[Op.gte] = new Date(date_from);
      if (date_to) {
        const end = new Date(date_to);
        end.setHours(23, 59, 59);
        where.created_at[Op.lte] = end;
      }
    }

    const assignmentWhere = {};
    if (master_id) assignmentWhere.master_id = master_id;

    const masterWhere = {};
    if (master_search) {
      masterWhere[Op.or] = [
        { name: { [Op.like]: `%${master_search}%` } },
        { surname: { [Op.like]: `%${master_search}%` } },
      ];
    }

    const requestWhere = {};
    if (city_id) requestWhere.city_id = city_id;

    const customerWhere = {};
    if (customer_search) {
      customerWhere[Op.or] = [
        { name: { [Op.like]: `%${customer_search}%` } },
        { surname: { [Op.like]: `%${customer_search}%` } },
        { phone: { [Op.like]: `%${customer_search}%` } },
      ];
    }

    const { count, rows } = await Report.findAndCountAll({
      where,
      include: [
        {
          model: Assignment,
          where: Object.keys(assignmentWhere).length ? assignmentWhere : undefined,
          include: [
            {
              model: Master,
              where: Object.keys(masterWhere).length ? masterWhere : undefined,
              attributes: ['id', 'name', 'surname'],
              required: !!master_search,
            },
            {
              model: Request,
              where: Object.keys(requestWhere).length ? requestWhere : undefined,
              required: !!city_id,
              include: [{
                model: Customer,
                where: Object.keys(customerWhere).length ? customerWhere : undefined,
                attributes: ['id', 'name', 'surname', 'phone'],
                required: !!customer_search,
              }],
            },
          ],
        },
      ],
      order: [['created_at', 'DESC']],
      limit, offset,
      subQuery: false,
    });

    success(res, paginatedResponse(rows, count, page, limit));
  } catch (err) { next(err); }
};

exports.detail = async (req, res, next) => {
  try {
    const report = await Report.findByPk(req.params.id, {
      include: [
        {
          model: Assignment,
          include: [
            { model: Master, attributes: ['id', 'name', 'surname'] },
            { model: Request, include: [{ model: Customer, attributes: ['id', 'name', 'surname', 'phone'] }] },
          ],
        },
        {
          model: ReportAnswer, as: 'answers',
          include: [
            { model: ReportQuestion, as: 'question' },
            { model: QuestionOption, as: 'selected_option' },
          ],
        },
        { model: ReportPhoto, as: 'photos' },
      ],
    });

    if (!report) return error(res, 'Rapor bulunamadı', 404);
    success(res, report);
  } catch (err) { next(err); }
};


exports.generatePdf = async (req, res, next) => {
  try {
    const pdf = await generateReportPdf(req.params.id);
    if (!pdf) return error(res, 'Rapor bulunamadı', 404);
    const buffer = Buffer.from(pdf);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="rapor-${req.params.id}.pdf"`);
    res.setHeader('Content-Length', buffer.length);
    res.end(buffer, 'binary');
  } catch (err) { next(err); }
};