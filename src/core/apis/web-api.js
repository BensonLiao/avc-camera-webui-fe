const api = require('./');

module.exports = {
  validation: {
    accountBirthday: ({account, birthday}) => api({
      /*
      Validate the birthday of the account.
      @param args {Object}
        account: {String}
        birthday: {String} "19910326"
      @response 204
       */
      method: 'post',
      url: '/api/validations/_account-birthday',
      data: {account, birthday}
    })
  },
  account: {
    login: ({account, password}) => api({
      /*
      Do authentication with account and password.
      @param args {Object}
        account: {String}
        password: {String}
      @returns {Promise<Object>}
      @response 200 {UserModel} with set-cookie
      @response 400 {Object}
        extra: {Object}
          loginFailedTimes: {Number}
      @response 429 {Object}
        extra: {Object}
          loginFailedTimes: {Number}
          loginLockExpiredTime: {Date}
       */
      method: 'post',
      url: '/api/account/_login',
      data: {account, password}
    }),
    changePasswordWithBirthday: ({account, birthday, password}) => api({
      /*
      Change the password with the birthday.
      @param args {Object}
        account: {String}
        birthday: {String} "19910326"
        password: {String}
      @response 200 {UserModel} with set-cookie
       */
      method: 'post',
      url: '/api/account/_change-password',
      data: {account, birthday, password}
    })
  }
};
