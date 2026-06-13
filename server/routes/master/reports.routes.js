const router = require('express').Router();
const c = require('../../controllers/master/reports.controller');
const upload = require('../../middlewares/upload');

router.post('/:assignmentId', upload.array('photos', 70), c.submit);

module.exports = router;
