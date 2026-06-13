const router = require('express').Router();
const c = require('../../controllers/admin/requests.controller');

router.get('/', c.list);
router.get('/:id', c.detail);
router.post('/:id/assign-master', c.assignMaster);
router.post('/:id/cancel-assignment', c.cancelAssignment);

module.exports = router;