const jwt = require('jsonwebtoken');
const { Customer } = require('../../models');
const { success, error } = require('../../utils/response');
const { normalizePhone } = require('../../utils/phone');
const { verifyOtp } = require('../../utils/otp');

const signToken = (customer) =>
  jwt.sign(
    { id: customer.id, role: 'customer', phone: customer.phone },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

exports.register = async (req, res, next) => {
  try {
    const { name, surname, city_id, code } = req.body;

    if (!name || !surname || !req.body.phone) {
      return error(res, 'Ad, soyad ve telefon zorunludur', 400);
    }
    const phone = normalizePhone(req.body.phone);
    if (!phone) return error(res, 'Geçerli bir cep telefonu numarası girin', 400);
    if (!code) return error(res, 'Doğrulama kodu gerekli', 400);

    const exists = await Customer.findOne({ where: { phone } });
    if (exists) return error(res, 'Bu telefon numarası zaten kayıtlı', 409);

    const otp = await verifyOtp(phone, 'customer_register', code);
    if (!otp.ok) return error(res, otp.message, otp.status);

    const customer = await Customer.create({
      name, surname, phone, city_id,
      status: 'active',
      phone_verified: true,
    });

    success(
      res,
      { token: signToken(customer), customer: { id: customer.id, name: customer.name, surname: customer.surname } },
      'Kayıt başarılı',
      201
    );
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { code } = req.body;
    const phone = normalizePhone(req.body.phone);
    if (!phone) return error(res, 'Geçerli bir cep telefonu numarası girin', 400);
    if (!code) return error(res, 'Doğrulama kodu gerekli', 400);

    const customer = await Customer.findOne({ where: { phone } });
    if (!customer) return error(res, 'Bu telefon numarası kayıtlı değil', 404);
    if (customer.status !== 'active') return error(res, 'Hesabınız aktif değil', 403);

    const otp = await verifyOtp(phone, 'customer_login', code);
    if (!otp.ok) return error(res, otp.message, otp.status);

    if (!customer.phone_verified) await customer.update({ phone_verified: true });

    success(res, {
      token: signToken(customer),
      customer: { id: customer.id, name: customer.name, surname: customer.surname, phone: customer.phone },
    });
  } catch (err) { next(err); }
};