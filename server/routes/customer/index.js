const router = require('express').Router();
const auth = require('../../middlewares/auth');
const role = require('../../middlewares/role');

router.use(auth, role('customer'));

router.use('/requests', require('./requests.routes'));
router.use('/profile', require('./profile.routes'));

module.exports = router;
