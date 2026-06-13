const { Ticket } = require('../../models');
const { success, error } = require('../../utils/response');
const { paginate, paginatedResponse } = require('../../utils/pagination');

exports.list = async (req, res, next) => {
  try {
    const { limit, offset, page } = paginate(req.query);
    const { status, sender_type } = req.query;
    const where = {};
    if (status) where.status = status;
    if (sender_type) where.sender_type = sender_type;

    const { count, rows } = await Ticket.findAndCountAll({
      where, order: [['created_at', 'DESC']], limit, offset,
    });
    success(res, paginatedResponse(rows, count, page, limit));
  } catch (err) { next(err); }
};

exports.detail = async (req, res, next) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) return error(res, 'Ticket bulunamadı', 404);
    success(res, ticket);
  } catch (err) { next(err); }
};

exports.close = async (req, res, next) => {
  try {
    const { admin_note } = req.body;
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) return error(res, 'Ticket bulunamadı', 404);
    await ticket.update({ status: 'closed', admin_note, closed_by: req.user.id, closed_at: new Date() });
    success(res, null, 'Ticket kapatıldı');
  } catch (err) { next(err); }
};
