// Türkiye cep telefonu numaralarını tek formata çevirir: 5XXXXXXXXX (10 hane)
// "0532 123 45 67", "+90 532 123 45 67", "905321234567" → "5321234567"
// Geçersizse null döner.
const normalizePhone = (input) => {
  if (!input) return null;
  let digits = String(input).replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('90')) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
  return /^5\d{9}$/.test(digits) ? digits : null;
};

module.exports = { normalizePhone };