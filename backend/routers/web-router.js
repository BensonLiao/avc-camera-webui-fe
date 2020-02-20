const express = require('express');
const rateLimit = require('express-rate-limit');
const errors = require('../models/errors');
const accountHandler = require('../handlers/account-handler');
const baseHandler = require('../handlers/base-handler');
const snapshotHandler = require('../handlers/snapshot-handler');
const systemHandler = require('../handlers/system-handler');
const validationHandler = require('../handlers/validation-handler');
const {LOGIN_ERROR_ATTEMPS_MAX} = require('../../src/core/constants');

class CustomRouter {
  constructor(router) {
    this.router = router;
    this.setRouter = this.setRouter.bind(this);
    this.get = this.get.bind(this);
    this.post = this.post.bind(this);
    this.put = this.put.bind(this);
    this.delete = this.delete.bind(this);
  }

  static promiseErrorHandler(func) {
    return (req, res, next) => {
      const result = func(req, res, next);

      if (result && typeof result.catch === 'function') {
        result.catch(error => {
          if (error instanceof Error) {
            // This error is errors.HttpXXX().
            next(error);
          } else {
            next(new errors.Http500(error));
          }
        });
      }

      return result;
    };
  }

  setRouter(method, path, ...handlers) {
    /*
    @param method {String} "get" | "post" | "put" | "delete"
    @param path {String}
    @param handlers {Array<Function>}
     */
    if (handlers.length > 1) {
      this.router[method](
        path,
        ...handlers.slice(0, handlers.length - 1),
        CustomRouter.promiseErrorHandler(handlers[handlers.length - 1])
      );
    } else {
      this.router[method](
        path,
        CustomRouter.promiseErrorHandler(handlers[0])
      );
    }
  }

  get(path, ...handlers) {
    this.setRouter('get', path, ...handlers);
  }

  post(path, ...handlers) {
    this.setRouter('post', path, ...handlers);
  }

  put(path, ...handlers) {
    this.setRouter('put', path, ...handlers);
  }

  delete(path, ...handlers) {
    this.setRouter('delete', path, ...handlers);
  }
}

module.exports = new express.Router();
const router = new CustomRouter(module.exports);

router.post('/api/_validate/account-birthday', validationHandler.validateAccountBirthday);
router.post(
  '/api/account/_login',
  rateLimit({
    keyGenerator: req => `/api/account/_login${req.ip}`,
    windowMs: 5 * 60 * 1000,
    max: LOGIN_ERROR_ATTEMPS_MAX,
    handler: (req, res, next) => {
      next(
        new errors.Http429('Incorrect account or password over 5 times.', {
          loginFailedTimes: req.rateLimit.current,
          loginLockExpiredTime: req.rateLimit.resetTime
        })
      );
    }
  }),
  accountHandler.login
);
router.post('/api/account/_logout', accountHandler.logout);
router.post('/api/account/_change-password', accountHandler.changePasswordWithBirthday);
router.put('/api/me/password', accountHandler.changeMyPassword);
router.put('/api/system/language', systemHandler.updateLanguage);
router.get('/api/snapshot', snapshotHandler.getSnapshot);

router.get(/.*/, baseHandler.baseView);
