const express = require('express');
const baseHandler = require('../handlers/base-handler');

const router = new express.Router();
module.exports = router;

router.get(/.*/, baseHandler.baseView);
