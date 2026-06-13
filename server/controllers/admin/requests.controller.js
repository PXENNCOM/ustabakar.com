const { Op } = require('sequelize');
const { Request, Customer, Payment, Assignment, Master, City, ServicePackage, RequestPhoto, Report } = require('../../models');
const { success, error } = require('../../utils/response');
const { paginate, paginatedResponse } = require('../../utils/pagination');

exports.list = async (req, res, next) => {
  try {
    const { limit, offset, page } = paginate(req.query);
    const { status, city_id, search, entry_type, date_from, date_to } = req.query;

    const where = {};
    if (status) where.status = status;
    if (city_id) where.city_id = city_id;
    if (entry_type) where.entry_type = entry_type;
    if (search) where['$Customer.name$'] = { [Op.like]: `%${search}%` };
    if (date_from || date_to) {
      where.created_at = {};
      if (date_from) where.created_at[Op.gte] = new Date(date_from);
      if (date_to) {
        const end = new Date(date_to);
        end.setHours(23, 59, 59);
        where.created_at[Op.lte] = end;
      }
    }

    const { count, rows } = await Request.findAndCountAll({
      where,
      include: [
        { model: Customer, attributes: ['id', 'name', 'surname', 'phone'] },
        { model: City, attributes: ['id', 'name'] },
        { model: Payment, attributes: ['id', 'amount', 'method', 'status'] },
        { model: ServicePackage, as: 'package', attributes: ['id', 'name', 'price'] },
      ],
      order: [['created_at', 'DESC']],
      limit, offset, subQuery: false,
    });

    success(res, paginatedResponse(rows, count, page, limit));
  } catch (err) { next(err); }
};

exports.detail = async (req, res, next) => {
  try {
    const request = await Request.findByPk(req.params.id, {
      include: [
        { model: Customer, attributes: { exclude: ['created_at', 'updated_at'] } },
        { model: City, attributes: ['id', 'name'] },
        { model: Payment },
        { model: ServicePackage, as: 'package' },
        { model: Assignment, include: [{ model: Master, attributes: ['id', 'name', 'surname', 'phone'] }, { model: Report }] },
        { model: RequestPhoto, as: 'photos' },
      ],
    });

    if (!request) return error(res, 'Talep bulunamadı', 404);
    success(res, request);
  } catch (err) { next(err); }
};

exports.assignMaster = async (req, res, next) => {
  try {
    const { master_id } = req.body;
    const request = await Request.findByPk(req.params.id);
    if (!request) return error(res, 'Talep bulunamadı', 404);
    if (request.status !== 'pending_assignment') return error(res, 'Bu talep usta ataması için uygun değil', 400);

    const master = await Master.findByPk(master_id);
    if (!master || master.status !== 'active') return error(res, 'Geçerli bir usta seçin', 400);

    await Assignment.create({
      request_id: request.id,
      master_id,
      assigned_by: req.user.id,
      status: 'active',
    });

    await request.update({ status: 'assigned' });
    success(res, null, 'Usta atandı');
  } catch (err) { next(err); }
};

exports.cancelAssignment = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const assignment = await Assignment.findOne({
      where: { request_id: req.params.id, status: 'active' },
    });
    if (!assignment) return error(res, 'Aktif görev bulunamadı', 404);

    await assignment.update({ status: 'cancelled', cancelled_reason: reason || null });
    await Request.update({ status: 'pending_assignment' }, { where: { id: req.params.id } });

    success(res, null, 'Görev iptal edildi');
  } catch (err) { next(err); }
};