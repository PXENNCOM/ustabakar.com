const router = require('express').Router();
const c = require('../../controllers/admin/masters.controller');

router.get('/', c.list);
router.get('/applications', c.applications);
router.get('/:id', c.detail);
router.post('/', c.create);
router.post('/:id/approve', c.approve);
router.post('/:id/reject', c.reject);
router.post('/:id/deactivate', c.deactivate);
router.post('/:id/activate', c.activate);
router.delete('/:id', c.remove);
router.post('/:id/pay', c.markPaid);

module.exports = router;
