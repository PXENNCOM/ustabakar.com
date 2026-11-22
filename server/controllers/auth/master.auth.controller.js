const fs = require('fs');
const jwt = require('jsonwebtoken');
const { Master } = require('../../models');
const { success, error } = require('../../utils/response');
const { normalizePhone } = require('../../utils/phone');
const { verifyOtp } = require('../../utils/otp');

// Kayıt başarısız olursa multer'ın diske yazdığı sertifika dosyasını sil
const removeUploadedFile = (file) => {
  if (file?.path) fs.unlink(file.path, () => {});
};

exports.login = async (req, res, next) => {
  try {
    const { code } = req.body;
    const phone = normalizePhone(req.body.phone);
    if (!phone) return error(res, 'Geçerli bir cep telefonu numarası girin', 400);
    if (!code) return error(res, 'Doğrulama kodu gerekli', 400);

    const master = await Master.findOne({ where: { phone } });
    if (!master) return error(res, 'Bu telefon numarası kayıtlı değil', 404);
    if (master.status !== 'active') return error(res, 'Hesabınız henüz aktif değil', 403);

    const otp = await verifyOtp(phone, 'master_login', code);
    if (!otp.ok) return error(res, otp.message, otp.status);

    if (!master.phone_verified) await master.update({ phone_verified: true });

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
  const fail = (message, status) => {
    removeUploadedFile(req.file);
    return error(res, message, status);
  };

  try {
    const { name, surname, tc, city_id, expertise_id, equipment, experience, reference, code } = req.body;

    if (!name || !surname || !req.body.phone || !city_id) {
      return fail('Ad, soyad, telefon ve il zorunludur', 400);
    }
    const phone = normalizePhone(req.body.phone);
    if (!phone) return fail('Geçerli bir cep telefonu numarası girin', 400);
    if (!code) return fail('Doğrulama kodu gerekli', 400);

    const exists = await Master.findOne({ where: { phone } });
    if (exists) return fail('Bu telefon numarası zaten kayıtlı', 409);

    const otp = await verifyOtp(phone, 'master_register', code);
    if (!otp.ok) return fail(otp.message, otp.status);

    const certificate_url = req.file ? `/uploads/certificates/${req.file.filename}` : null;

    const master = await Master.create({
      name, surname, tc, phone, city_id,
      district_id: null,
      expertise_id: expertise_id || null,
      equipment, experience, reference,
      certificate_url,
      phone_verified: true,
      status: 'pending',
      registered_by: 'app',
    });

    success(res, { id: master.id }, 'Başvurunuz alındı. Ekibimiz sizi inceleyip onaylayacak.', 201);
  } catch (err) {
    removeUploadedFile(req.file);
    next(err);
  }
};