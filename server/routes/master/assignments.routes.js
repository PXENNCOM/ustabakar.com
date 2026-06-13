const router = require('express').Router();
const c = require('../../controllers/master/assignments.controller');

router.get('/active', c.active);
router.get('/history', c.history);
router.get('/:id', c.detail);
router.get('/:id/pdf', c.generatePdf);


module.exports = router;
