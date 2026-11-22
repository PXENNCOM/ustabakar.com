const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 10,
  message: { success: false, message: 'Çok fazla deneme yapıldı. 15 dakika sonra tekrar deneyin.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// IP başına SMS kodu isteği sınırı (numara başına sınır ayrıca utils/otp.js içinde)
const otpSendLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 saat
  max: 10,
  message: { success: false, message: 'Çok fazla kod istendi. Lütfen daha sonra tekrar deneyin.' },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { loginLimiter, otpSendLimiter };