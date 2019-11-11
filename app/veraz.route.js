const express = require('express');
const router = express.Router();

const vc = require('./veraz.controller');
const mm = require('./middlewares');


router.get('/veraz/:cuil', mm.contadorRequest, vc.get);
router.get('/veraz', mm.contadorRequest, vc.getBulk);
router.post('/veraz', mm.isAdmin, vc.create);
router.patch('/veraz/:cuil', mm.isAdmin, vc.update);

module.exports = router;