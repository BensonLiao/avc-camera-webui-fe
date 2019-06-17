const express = require('express');
const accountHandler = require('../handlers/account-handler');
const baseHandler = require('../handlers/base-handler');
const validationHandler = require('../handlers/validation-handler');

const router = new express.Router();
module.exports = router;

router.post('/api/account/_login', accountHandler.login);
router.post('/api/account/_change-password', accountHandler.changePasswordWithBirthday);
router.post('/api/validations/_account-birthday', validationHandler.validateAccountBirthday);

router.get(/.*/, baseHandler.baseView);
