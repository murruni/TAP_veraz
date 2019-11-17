const express = require('express');
const router = express.Router();

router.all('/veraz', require('./veraz'));

module.exports = router;