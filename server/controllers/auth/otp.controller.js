const { Customer, Master } = require('../../models');
const { success, error } = require('../../utils/response');
const { normalizePhone } = require('../../utils/phone');
const { createOtp, discardOtp } = require('../../utils/otp');
const { sendSms } = require('../../services/sms.service');

// Kodun hangi işlem için istendiği
const PURPOSES = {
  customer_login: { Model: Customer, action: 'login', inactiveMsg: 'Hesabınız aktif değil' },
  customer_register: { Model: Customer, action: 'register' },
  master_login: { Model: Master, action: 'login', inactiveMsg: 'Hesabınız henüz aktif değil' },
  master_register: { Model: Master, action: 'register' },
};

exports.sendOtp = async (req, res, next) => {
  try {
    const purpose = String(req.body.purpose || '');
    const config = Object.hasOwn(PURPOSES, purpose) ? PURPOSES[purpose] : null;
    if (!config) return error(res, 'Geçersiz işlem türü', 400);

    const phone = normalizePhone(req.body.phone);
    if (!phone) return error(res, 'Geçerli bir cep telefonu numarası girin', 400);

    // Gereksiz SMS gönderip kredi harcamamak için önce durumu kontrol et
    const user = await config.Model.findOne({ where: { phone } });
    if (config.action === 'register' && user) {
      return error(res, 'Bu telefon numarası zaten kayıtlı', 409);
    }
    if (config.action === 'login') {
      if (!user) return error(res, 'Bu telefon numarası kayıtlı değil', 404);
      if (user.status !== 'active') return error(res, config.inactiveMsg, 403);
    }

    const otp = await createOtp(phone, purpose);
    if (!otp.ok) return error(res, otp.message, otp.status);

    const minutes = Math.round(otp.expiresIn / 60);
    const text = `ustabakar.com doğrulama kodunuz: ${otp.code}. Kod ${minutes} dakika geçerlidir, kimseyle paylaşmayın.`;
    const sms = await sendSms(phone, text, { logText: text.replace(otp.code, '******') });

    if (!sms.ok) {
      await discardOtp(otp.id);
      return error(res, 'SMS gönderilemedi. Lütfen biraz sonra tekrar deneyin.', 502);
    }

    success(res, { expires_in: otp.expiresIn, resend_in: otp.resendIn }, 'Doğrulama kodu gönderildi');
  } catch (err) { next(err); }
};