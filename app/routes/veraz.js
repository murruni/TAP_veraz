const express = require('express');
const router = express.Router();

const vc = require('../controllers/veraz');
const mm = require('../utils/middleware');

// getters
router.get('/veraz/:cuil(\\d+)', mm.contadorRequest, vc.get);
router.put('/veraz', mm.contadorRequest, vc.getBulk);
// updates
router.post('/veraz', mm.isAdmin, vc.create);
router.patch('/veraz/:cuil', mm.isAdmin, vc.update);

module.exports = router;