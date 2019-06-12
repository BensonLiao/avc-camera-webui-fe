const express = require('express');
const accountHandler = require('../handlers/account-handler');
const baseHandler = require('../handlers/base-handler');

const router = new express.Router();
module.exports = router;

router.post('/api/account/_login', accountHandler.login);

router.get(/.*/, baseHandler.baseView);
