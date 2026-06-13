const { error } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'SequelizeValidationError') {
    return error(res, 'Doğrulama hatası', 422, err.errors.map(e => e.message));
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return error(res, 'Bu kayıt zaten mevcut', 409);
  }

  if (err.name === 'JsonWebTokenError') {
    return error(res, 'Geçersiz token', 401);
  }

  if (err.name === 'TokenExpiredError') {
    return error(res, 'Token süresi doldu', 401);
  }

  return error(res, err.message || 'Sunucu hatası', err.statusCode || 500);
};

module.exports = errorHandler;
