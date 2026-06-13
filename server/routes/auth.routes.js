const router = require('express').Router();
const adminAuthController = require('../controllers/auth/admin.auth.controller');
const masterAuthController = require('../controllers/auth/master.auth.controller');
const customerAuthController = require('../controllers/auth/customer.auth.controller');
const { loginLimiter } = require('../middlewares/rateLimiter');
const upload = require('../middlewares/upload');

// Admin
router.post('/admin/login', loginLimiter, adminAuthController.login);

// Master
router.post('/master/login', loginLimiter, masterAuthController.login);
router.post('/master/register', upload.single('certificate'), masterAuthController.register);

// Customer
router.post('/customer/register', customerAuthController.register);
router.post('/customer/login', loginLimiter, customerAuthController.login);

module.exports = router;