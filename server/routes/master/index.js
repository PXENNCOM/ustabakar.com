const router = require('express').Router();
const auth = require('../../middlewares/auth');
const role = require('../../middlewares/role');

router.use(auth, role('master'));

router.use('/assignments', require('./assignments.routes'));
router.use('/reports', require('./reports.routes'));
router.use('/earnings', require('./earnings.routes'));
router.use('/profile', require('./profile.routes'));

module.exports = router;
