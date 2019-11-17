const express = require('express');
const router = express.Router();

const vc = require('../controllers/veraz');
const mm = require('../utils/middleware');

router.get('/veraz/:cuil(\\d+)', mm.contadorRequest, vc.get);
router.get('/veraz', mm.contadorRequest, vc.getBulk);
router.post('/veraz', mm.isAdmin, vc.create);
router.patch('/veraz/:cuil', mm.isAdmin, vc.update);

module.exports = router;