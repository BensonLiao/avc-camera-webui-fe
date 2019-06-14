const api = require('./');

module.exports = {
  account: {
    login: ({account, password}) => api({
      /*
      Do authentication with account and password.
      @param args {Object}
        account: {String}
        password: {String}
      @returns {Promise<Object>}
      @response 200 {UserModel}
      @response 400 {Object}
        extra: {Object}
          loginFailedTimes: {Number}
          isTooManyLoginFailed: {Boolean}
          loginLockExpiredTime: {Date}
       */
      method: 'post',
      url: '/api/account/_login',
      data: {account, password}
    })
  }
};
