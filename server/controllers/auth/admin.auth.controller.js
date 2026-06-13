const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Admin } = require('../../models');
const { success, error } = require('../../utils/response');

const MAX_ATTEMPTS = 5;

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return error(res, 'Email ve şifre gerekli', 400);

    const admin = await Admin.findOne({ where: { email } });
    if (!admin) return error(res, 'Hatalı email veya şifre', 401);

    if (admin.locked_until && new Date() < new Date(admin.locked_until)) {
      return error(res, 'Hesap geçici olarak kilitlendi. Lütfen bekleyin.', 423);
    }

    const valid = await bcrypt.compare(password, admin.password_hash);

    if (!valid) {
      const attempts = admin.failed_login_attempts + 1;
      const update = { failed_login_attempts: attempts };
      if (attempts >= MAX_ATTEMPTS) {
        update.locked_until = new Date(Date.now() + 30 * 60 * 1000); // 30 dk
      }
      await admin.update(update);
      return error(res, 'Hatalı email veya şifre', 401);
    }

    await admin.update({ failed_login_attempts: 0, locked_until: null });

    const token = jwt.sign(
      { id: admin.id, role: 'admin', email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    success(res, { token, admin: { id: admin.id, name: admin.name, email: admin.email } });
  } catch (err) { next(err); }
};
