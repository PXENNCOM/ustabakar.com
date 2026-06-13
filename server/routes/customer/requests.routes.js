const router = require('express').Router();
const c = require('../../controllers/customer/requests.controller');
const upload = require('../../middlewares/upload');

router.get('/', c.list);
router.get('/:id', c.detail);
router.post('/', upload.array('photos', 20), c.create);
router.get('/:id/pdf', c.generatePdf);

module.exports = router;