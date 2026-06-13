const path = require('path');
const { Request, Payment, Assignment, Report, RequestPhoto, City, ServicePackage, ReportAnswer, ReportPhoto, ReportQuestion, ReportCategory, QuestionOption } = require('../../models');
const { success, error } = require('../../utils/response');
const { paginate, paginatedResponse } = require('../../utils/pagination');
const generateReportPdf = require('../../utils/pdf');

exports.list = async (req, res, next) => {
  try {
    const { limit, offset, page } = paginate(req.query);
    const { count, rows } = await Request.findAndCountAll({
      where: { customer_id: req.user.id },
      include: [
        { model: City, attributes: ['id', 'name'] },
        { model: Payment, attributes: ['id', 'amount', 'method', 'status'] },
        { model: ServicePackage, as: 'package', attributes: ['id', 'name', 'price'] },
      ],
      order: [['created_at', 'DESC']],
      limit, offset,
    });
    success(res, paginatedResponse(rows, count, page, limit));
  } catch (err) { next(err); }
};

exports.detail = async (req, res, next) => {
  try {
    const request = await Request.findOne({
      where: { id: req.params.id, customer_id: req.user.id },
      include: [
        { model: City, attributes: ['id', 'name'] },
        { model: Payment },
        { model: ServicePackage, as: 'package' },
        { model: RequestPhoto, as: 'photos' },
        {
          model: Assignment,
          where: { status: ['active', 'completed'] },
          required: false,
          include: [{
            model: Report,
            include: [
              {
                model: ReportAnswer,
                as: 'answers',
                include: [
                  { model: ReportQuestion, as: 'question', include: [{ model: ReportCategory, as: 'category' }] },
                  { model: QuestionOption, as: 'selected_option' },
                ],
              },
              { model: ReportPhoto, as: 'photos' },
            ],
          }],
        },
      ],
    });
    if (!request) return error(res, 'Talep bulunamadı', 404);
    success(res, request);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { city_id, package_id, entry_type, listing_url, brand, model, year, seller_name, seller_phone, customer_note } = req.body;

    if (!city_id || !package_id || !entry_type) {
      return error(res, 'İl, paket ve giriş tipi zorunludur', 400);
    }
    if (entry_type === 'link' && !listing_url) return error(res, 'İlan linki zorunludur', 400);
    if (entry_type === 'manual' && (!brand || !model)) return error(res, 'Marka ve model zorunludur', 400);

    const pkg = await ServicePackage.findByPk(package_id);
    if (!pkg || !pkg.is_active) return error(res, 'Geçersiz paket', 400);

    const request = await Request.create({
      customer_id: req.user.id, city_id, package_id, entry_type, listing_url,
      brand, model, year, seller_name, seller_phone, customer_note,
      status: 'pending_assignment',
    });

    if (req.files && req.files.length) {
      await RequestPhoto.bulkCreate(req.files.map(f => ({
        request_id: request.id,
        url: `/uploads/requests/${path.basename(f.path)}`,
      })));
    }

    await Payment.create({
      request_id: request.id,
      amount: pkg.price,
      method: 'card',
      status: 'approved',
      paid_at: new Date(),
    });

    success(res, { id: request.id }, 'Talebiniz alındı', 201);
  } catch (err) { next(err); }
};

exports.generatePdf = async (req, res, next) => {
  try {
    const request = await Request.findOne({
      where: { id: req.params.id, customer_id: req.user.id },
      include: [{
        model: Assignment,
        where: { status: 'completed' },
        required: true,
        include: [{ model: Report }],
      }],
    });
    const report = request?.Assignments?.[0]?.Report;
    if (!report) return error(res, 'Rapor bulunamadı', 404);
    const pdf = await generateReportPdf(report.id);
    if (!pdf) return error(res, 'PDF oluşturulamadı', 500);
    const buffer = Buffer.from(pdf);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="rapor-${report.id}.pdf"`);
    res.setHeader('Content-Length', buffer.length);
    res.end(buffer, 'binary');
  } catch (err) { next(err); }
};