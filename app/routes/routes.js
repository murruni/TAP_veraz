const express = require('express');
const router = express.Router();

router.all(/^\/veraz(\/\d{1,20})?$/, require('./veraz'));

module.exports = router;