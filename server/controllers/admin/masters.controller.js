const { Op } = require('sequelize');
const { Master, City, District, MasterExpertise, Assignment, Earning } = require('../../models');
const { success, error } = require('../../utils/response');
const { paginate, paginatedResponse } = require('../../utils/pagination');
const bcrypt = require('bcryptjs');

exports.list = async (req, res, next) => {
  try {
    const { limit, offset, page } = paginate(req.query);
    const { status, city_id, search, expertise_id, registered_by, date_from, date_to } = req.query;

    const where = {};
    if (status) where.status = status;
    if (city_id) where.city_id = city_id;
    if (expertise_id) where.expertise_id = expertise_id;
    if (registered_by) where.registered_by = registered_by;
    if (search) where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { surname: { [Op.like]: `%${search}%` } },
      { phone: { [Op.like]: `%${search}%` } },
    ];
    if (date_from || date_to) {
      where.created_at = {};
      if (date_from) where.created_at[Op.gte] = new Date(date_from);
      if (date_to) {
        const end = new Date(date_to);
        end.setHours(23, 59, 59);
        where.created_at[Op.lte] = end;
      }
    }

    const { count, rows } = await Master.findAndCountAll({
      where,
      include: [
        { model: City, attributes: ['id', 'name'] },
        { model: District, attributes: ['id', 'name'] },
        { model: MasterExpertise, as: 'expertise', attributes: ['id', 'name'] },
      ],
      order: [['created_at', 'DESC']],
      limit, offset,
    });

    success(res, paginatedResponse(rows, count, page, limit));
  } catch (err) { next(err); }
};

exports.applications = async (req, res, next) => {
  try {
    const { limit, offset, page } = paginate(req.query);
    const { count, rows } = await Master.findAndCountAll({
      where: { status: 'pending' },
      include: [
        { model: City, attributes: ['id', 'name'] },
        { model: MasterExpertise, as: 'expertise', attributes: ['id', 'name'] },
      ],
      order: [['created_at', 'DESC']],
      limit, offset,
    });
    success(res, paginatedResponse(rows, count, page, limit));
  } catch (err) { next(err); }
};

exports.detail = async (req, res, next) => {
  try {
    const master = await Master.findByPk(req.params.id, {
      include: [
        { model: City, attributes: ['id', 'name'] },
        { model: District, attributes: ['id', 'name'] },
        { model: MasterExpertise, as: 'expertise', attributes: ['id', 'name'] },
      ],
    });
    if (!master) return error(res, 'Usta bulunamadı', 404);

    const completedCount = await Assignment.count({ where: { master_id: master.id, status: 'completed' } });
    const totalEarning = await Earning.sum('net_amount', { where: { master_id: master.id } });
    const pendingEarning = await Earning.sum('net_amount', { where: { master_id: master.id, status: 'pending' } });

    success(res, { ...master.toJSON(), completedCount, totalEarning: totalEarning || 0, pendingEarning: pendingEarning || 0 });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { name, surname, phone, city_id, district_id, expertise_id } = req.body;
    if (!name || !surname || !phone) return error(res, 'Ad, soyad ve telefon zorunludur', 400);

    const exists = await Master.findOne({ where: { phone } });
    if (exists) return error(res, 'Bu telefon zaten kayıtlı', 409);

    const master = await Master.create({
      ...req.body, status: 'active', registered_by: 'admin',
    });
    success(res, master, 'Usta oluşturuldu', 201);
  } catch (err) { next(err); }
};

exports.approve = async (req, res, next) => {
  try {
    const master = await Master.findByPk(req.params.id);
    if (!master) return error(res, 'Usta bulunamadı', 404);
    await master.update({ status: 'active' });
    success(res, null, 'Usta onaylandı');
  } catch (err) { next(err); }
};

exports.reject = async (req, res, next) => {
  try {
    const master = await Master.findByPk(req.params.id);
    if (!master) return error(res, 'Usta bulunamadı', 404);
    await master.update({ status: 'rejected' });
    success(res, null, 'Başvuru reddedildi');
  } catch (err) { next(err); }
};

exports.deactivate = async (req, res, next) => {
  try {
    const master = await Master.findByPk(req.params.id);
    if (!master) return error(res, 'Usta bulunamadı', 404);
    await master.update({ status: 'passive' });
    success(res, null, 'Usta pasife alındı');
  } catch (err) { next(err); }
};

exports.activate = async (req, res, next) => {
  try {
    const master = await Master.findByPk(req.params.id);
    if (!master) return error(res, 'Usta bulunamadı', 404);
    await master.update({ status: 'active' });
    success(res, null, 'Usta aktif edildi');
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const master = await Master.findByPk(req.params.id);
    if (!master) return error(res, 'Usta bulunamadı', 404);
    await master.update({ status: 'deleted' });
    success(res, null, 'Usta sistemden kaldırıldı');
  } catch (err) { next(err); }
};

exports.markPaid = async (req, res, next) => {
  try {
    const updated = await Earning.update(
      { status: 'paid', paid_at: new Date(), paid_by: req.user.id },
      { where: { master_id: req.params.id, status: 'pending' } }
    );
    success(res, null, 'Ödeme yapıldı olarak işaretlendi');
  } catch (err) { next(err); }
};
