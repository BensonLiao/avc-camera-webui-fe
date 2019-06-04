const {Router} = require('capybara-router');
const history = require('history');

module.exports = new Router({
  history: history.createBrowserHistory(),
  routes: [
    {
      name: 'web',
      uri: '/',
      isAbstract: true,
      component: require('./pages/layout')
    },
    {
      name: 'web.home',
      uri: '',
      onEnter: () => {
        document.title = 'Home';
      },
      component: require('./pages/home')
    },
    {
      name: 'web.login',
      uri: 'login',
      onEnter: () => {
        document.title = 'Login';
      },
      component: require('./pages/account/login')
    },
    {
      name: 'not-found',
      uri: '.*',
      component: require('./pages/shared/not-found')
    }
  ],
  errorComponent: require('./pages/shared/error')
});
