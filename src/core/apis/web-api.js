const api = require('./');

module.exports = {
  account: {
    login: ({account, password}) => api({
      method: 'post',
      url: '/api/account/_login',
      data: {account, password}
    })
  }
};
