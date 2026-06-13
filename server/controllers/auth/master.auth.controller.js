const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Master, MasterExpertise, City, District } = require('../../models');
const { success, error } = require('../../utils/response');

exports.login = async (req, res, next) => {
  try {
    const { phone } = req.body;
    if (!phone) return error(res, 'Telefon numarası gerekli', 400);

    const master = await Master.findOne({ where: { phone } });
    if (!master) return error(res, 'Bu telefon numarası kayıtlı değil', 404);
    if (master.status !== 'active') return error(res, 'Hesabınız henüz aktif değil', 403);

    // Gerçek projede burada SMS OTP gönderilir
    // Şimdilik direkt token dönüyoruz
    const token = jwt.sign(
      { id: master.id, role: 'master', phone: master.phone },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    success(res, {
      token,
      master: { id: master.id, name: master.name, surname: master.surname, phone: master.phone, status: master.status },
    });
  } catch (err) { next(err); }
};

exports.register = async (req, res, next) => {
  try {
    const { name, surname, tc, phone, city_id, district_name, expertise_id, equipment, experience, reference } = req.body;

    if (!name || !surname || !phone || !city_id) {
      return error(res, 'Ad, soyad, telefon ve il zorunludur', 400);
    }

    const exists = await Master.findOne({ where: { phone } });
    if (exists) return error(res, 'Bu telefon numarası zaten kayıtlı', 409);

    const certificate_url = req.file ? `/uploads/certificates/${req.file.filename}` : null;

    const master = await Master.create({
      name, surname, tc, phone, city_id,
      district_id: null,
      expertise_id: expertise_id || null,
      equipment, experience, reference,
      certificate_url,
      status: 'pending',
      registered_by: 'app',
    });

    success(res, { id: master.id }, 'Başvurunuz alındı. Ekibimiz sizi inceleyip onaylayacak.', 201);
  } catch (err) { next(err); }
};
