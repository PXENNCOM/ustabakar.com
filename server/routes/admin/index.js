const router = require('express').Router();
const auth = require('../../middlewares/auth');
const role = require('../../middlewares/role');

router.use(auth, role('admin'));

router.use('/requests', require('./requests.routes'));
router.use('/masters', require('./masters.routes'));
router.use('/reports', require('./reports.routes'));
router.use('/tickets', require('./tickets.routes'));
router.use('/settings', require('./settings.routes'));

module.exports = router;
