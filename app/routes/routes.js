const express = require('express');
const router = express.Router();

router.all('/veraz', requiere('./veraz'));

module.exports = router;