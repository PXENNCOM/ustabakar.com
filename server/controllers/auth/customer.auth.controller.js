const jwt = require('jsonwebtoken');
const { Customer, City } = require('../../models');
const { success, error } = require('../../utils/response');

exports.register = async (req, res, next) => {
  try {
    const { name, surname, phone, city_id } = req.body;

    if (!name || !surname || !phone) {
      return error(res, 'Ad, soyad ve telefon zorunludur', 400);
    }

    const exists = await Customer.findOne({ where: { phone } });
    if (exists) return error(res, 'Bu telefon numarası zaten kayıtlı', 409);

    const customer = await Customer.create({ name, surname, phone, city_id, status: 'active' });

    const token = jwt.sign(
      { id: customer.id, role: 'customer', phone: customer.phone },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    success(res, { token, customer: { id: customer.id, name: customer.name, surname: customer.surname } }, 'Kayıt başarılı', 201);
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { phone } = req.body;
    if (!phone) return error(res, 'Telefon numarası gerekli', 400);

    const customer = await Customer.findOne({ where: { phone } });
    if (!customer) return error(res, 'Bu telefon numarası kayıtlı değil', 404);
    if (customer.status !== 'active') return error(res, 'Hesabınız aktif değil', 403);

    // Gerçek projede SMS OTP gönderilir
    const token = jwt.sign(
      { id: customer.id, role: 'customer', phone: customer.phone },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    success(res, {
      token,
      customer: { id: customer.id, name: customer.name, surname: customer.surname, phone: customer.phone },
    });
  } catch (err) { next(err); }
};
