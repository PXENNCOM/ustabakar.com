const router = require('express').Router();
const c = require('../../controllers/admin/tickets.controller');

router.get('/', c.list);
router.get('/:id', c.detail);
router.post('/:id/close', c.close);

module.exports = router;
