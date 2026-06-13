const router = require('express').Router();
const c = require('../../controllers/master/profile.controller');

router.get('/', c.me);
router.post('/ticket', c.createTicket);

module.exports = router;
