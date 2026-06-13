const router = require('express').Router();
const c = require('../../controllers/master/earnings.controller');

router.get('/', c.list);

module.exports = router;
