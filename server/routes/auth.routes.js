const router = require('express').Router();
const adminAuthController = require('../controllers/auth/admin.auth.controller');
const masterAuthController = require('../controllers/auth/master.auth.controller');
const customerAuthController = require('../controllers/auth/customer.auth.controller');
const otpController = require('../controllers/auth/otp.controller');
const { loginLimiter, otpSendLimiter } = require('../middlewares/rateLimiter');
const upload = require('../middlewares/upload');

// SMS doğrulama kodu gönder (customer/master, login/register)
router.post('/otp/send', otpSendLimiter, otpController.sendOtp);

// Admin
router.post('/admin/login', loginLimiter, adminAuthController.login);

// Master
router.post('/master/login', loginLimiter, masterAuthController.login);
router.post('/master/register', loginLimiter, upload.single('certificate'), masterAuthController.register);

// Customer
router.post('/customer/register', loginLimiter, customerAuthController.register);
router.post('/customer/login', loginLimiter, customerAuthController.login);

module.exports = router;