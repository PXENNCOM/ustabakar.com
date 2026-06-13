const { error } = require('../utils/response');

const role = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return error(res, 'Yetkisiz erişim', 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return error(res, 'Bu işlem için yetkiniz yok', 403);
    }

    next();
  };
};

module.exports = role;
