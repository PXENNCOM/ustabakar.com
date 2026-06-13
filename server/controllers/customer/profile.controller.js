const { Customer, City, Ticket } = require('../../models');
const { success, error } = require('../../utils/response');

exports.me = async (req, res, next) => {
  try {
    const customer = await Customer.findByPk(req.user.id, {
      include: [{ model: City, attributes: ['id', 'name'] }],
    });
    if (!customer) return error(res, 'Kullanıcı bulunamadı', 404);
    success(res, customer);
  } catch (err) { next(err); }
};

exports.createTicket = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message) return error(res, 'Mesaj zorunludur', 400);
    const ticket = await Ticket.create({ sender_id: req.user.id, sender_type: 'customer', message });
    success(res, ticket, 'Talebiniz iletildi', 201);
  } catch (err) { next(err); }
};
