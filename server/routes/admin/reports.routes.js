const router = require('express').Router();
const c = require('../../controllers/admin/reports.controller');

router.get('/', c.list);
router.get('/:id', c.detail);
router.get('/:id/pdf', c.generatePdf);


module.exports = router;
