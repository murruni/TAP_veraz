const express = require('express');
const router = express.Router();

const vc = require('./veraz.controller');

router.get('/veraz/:cuil(\\d+)', vc.get);
router.get('/veraz', vc.getBulk);
router.post('/veraz', vc.create);
router.patch('/veraz/:cuil', vc.update);

module.exports = router;