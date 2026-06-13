const router = require('express').Router();

router.use('/auth', require('./auth.routes'));
router.use('/admin', require('./admin/index'));
router.use('/master', require('./master/index'));
router.use('/customer', require('./customer/index'));
router.use('/common', require('./common.routes'));


router.get('/health', (req, res) => res.json({ success: true, message: 'API çalışıyor.' }));

module.exports = router;
