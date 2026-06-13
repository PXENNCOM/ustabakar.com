const router = require('express').Router();
const c = require('../../controllers/customer/profile.controller');

router.get('/', c.me);
router.post('/ticket', c.createTicket);

module.exports = router;
