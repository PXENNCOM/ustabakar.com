const crypto = require('crypto');
const { Op } = require('sequelize');
const { sequelize, OtpCode } = require('../models');

const OTP_TTL_SECONDS = 180;          // Kod geçerlilik süresi (3 dk)
const RESEND_COOLDOWN_SECONDS = 60;   // Aynı numaraya yeni kod için bekleme
const MAX_SENDS_PER_HOUR = 5;         // Numara başına saatlik SMS sınırı
const MAX_VERIFY_ATTEMPTS = 5;        // Kod başına deneme hakkı

// Math.random tahmin edilebilir; kriptografik olarak güvenli üretici kullanılıyor
const generateOtp = () => crypto.randomInt(100000, 1000000).toString();

// Kodlar veritabanında düz metin değil, HMAC özeti olarak tutulur
const hashOtp = (code) =>
  crypto
    .createHmac('sha256', process.env.OTP_SECRET || process.env.JWT_SECRET)
    .update(String(code))
    .digest('hex');

const createOtp = async (phone, purpose) => {
  const now = Date.now();

  const last = await OtpCode.findOne({ where: { phone }, order: [['created_at', 'DESC']] });
  if (last) {
    const elapsed = (now - new Date(last.created_at).getTime()) / 1000;
    if (elapsed < RESEND_COOLDOWN_SECONDS) {
      const wait = Math.ceil(RESEND_COOLDOWN_SECONDS - elapsed);
      return { ok: false, status: 429, message: `Yeni kod istemek için ${wait} saniye bekleyin` };
    }
  }

  const sentLastHour = await OtpCode.count({
    where: { phone, created_at: { [Op.gt]: new Date(now - 60 * 60 * 1000) } },
  });
  if (sentLastHour >= MAX_SENDS_PER_HOUR) {
    return { ok: false, status: 429, message: 'Çok fazla kod istendi. Lütfen daha sonra tekrar deneyin.' };
  }

  // Aynı işlem için önceki kodları geçersiz kıl; sadece en son kod geçerli olsun
  await OtpCode.update(
    { consumed_at: new Date(now) },
    { where: { phone, purpose, consumed_at: null } }
  );

  const code = generateOtp();
  const otp = await OtpCode.create({
    phone,
    purpose,
    code_hash: hashOtp(code),
    expires_at: new Date(now + OTP_TTL_SECONDS * 1000),
  });

  return { ok: true, id: otp.id, code, expiresIn: OTP_TTL_SECONDS, resendIn: RESEND_COOLDOWN_SECONDS };
};

// SMS gönderilemezse kaydı sil ki kullanıcı bekleme süresine takılmasın
const discardOtp = (id) => OtpCode.destroy({ where: { id } });

const verifyOtp = async (phone, purpose, code) => {
  const invalid = { ok: false, status: 400, message: 'Doğrulama kodu hatalı veya süresi dolmuş' };
  if (!/^\d{6}$/.test(String(code ?? ''))) return invalid;

  const otp = await OtpCode.findOne({
    where: { phone, purpose, consumed_at: null, expires_at: { [Op.gt]: new Date() } },
    order: [['created_at', 'DESC']],
  });
  if (!otp) return invalid;

  // Deneme hakkını atomik olarak düş (paralel isteklerle sınır aşılamasın)
  const [claimed] = await OtpCode.update(
    { attempts: sequelize.literal('attempts + 1') },
    { where: { id: otp.id, attempts: { [Op.lt]: MAX_VERIFY_ATTEMPTS } } }
  );
  if (claimed !== 1) {
    return { ok: false, status: 429, message: 'Çok fazla hatalı deneme. Lütfen yeni kod isteyin.' };
  }

  const isMatch = crypto.timingSafeEqual(
    Buffer.from(otp.code_hash, 'hex'),
    Buffer.from(hashOtp(code), 'hex')
  );
  if (!isMatch) return invalid;

  // Kodu tek kullanımlık yap
  const [consumed] = await OtpCode.update(
    { consumed_at: new Date() },
    { where: { id: otp.id, consumed_at: null } }
  );
  if (consumed !== 1) return invalid;

  return { ok: true };
};

module.exports = { generateOtp, createOtp, discardOtp, verifyOtp };