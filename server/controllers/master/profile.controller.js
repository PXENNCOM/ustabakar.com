const { Master, City, District, MasterExpertise, Assignment, Ticket } = require('../../models');
const { success, error } = require('../../utils/response');

exports.me = async (req, res, next) => {
  try {
    const master = await Master.findByPk(req.user.id, {
      include: [
        { model: City, attributes: ['id', 'name'] },
        { model: District, attributes: ['id', 'name'] },
        { model: MasterExpertise, as: 'expertise', attributes: ['id', 'name'] },
      ],
      attributes: { exclude: ['tc'] },
    });
    if (!master) return error(res, 'Usta bulunamadı', 404);

    const completedCount = await Assignment.count({ where: { master_id: req.user.id, status: 'completed' } });
    success(res, { ...master.toJSON(), completedCount });
  } catch (err) { next(err); }
};

exports.createTicket = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message) return error(res, 'Mesaj zorunludur', 400);
    const ticket = await Ticket.create({ sender_id: req.user.id, sender_type: 'master', message });
    success(res, ticket, 'Talebiniz iletildi', 201);
  } catch (err) { next(err); }
};
