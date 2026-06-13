const { Earning, Assignment, Request } = require('../../models');
const { success } = require('../../utils/response');
const { paginate, paginatedResponse } = require('../../utils/pagination');
const { Op } = require('sequelize');

exports.list = async (req, res, next) => {
  try {
    const { limit, offset, page } = paginate(req.query);
    const { filter } = req.query; // this_month | last_month | all

    const where = { master_id: req.user.id };
    if (filter === 'this_month') {
      const start = new Date(); start.setDate(1); start.setHours(0, 0, 0, 0);
      where.created_at = { [Op.gte]: start };
    } else if (filter === 'last_month') {
      const start = new Date(); start.setMonth(start.getMonth() - 1); start.setDate(1); start.setHours(0, 0, 0, 0);
      const end = new Date(); end.setDate(0); end.setHours(23, 59, 59, 999);
      where.created_at = { [Op.between]: [start, end] };
    }

    const { count, rows } = await Earning.findAndCountAll({
      where,
      include: [{ model: Assignment, include: [{ model: Request, attributes: ['id', 'brand', 'model', 'year'] }] }],
      order: [['created_at', 'DESC']],
      limit, offset,
    });

    const totalNet = await Earning.sum('net_amount', { where: { master_id: req.user.id } });
    const pendingNet = await Earning.sum('net_amount', { where: { master_id: req.user.id, status: 'pending' } });

    success(res, { ...paginatedResponse(rows, count, page, limit), totalNet: totalNet || 0, pendingNet: pendingNet || 0 });
  } catch (err) { next(err); }
};
