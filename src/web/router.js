const {Router} = require('capybara-router');
const history = require('history');
const Layout = require('./pages/layout');
const Home = require('./pages/home');
const NotFound = require('./pages/shared/not-found');
const ErrorPage = require('./pages/shared/error');

module.exports = new Router({
  history: history.createBrowserHistory(),
  routes: [
    {
      name: 'web',
      uri: '/',
      isAbstract: true,
      component: Layout
    },
    {
      name: 'web.home',
      uri: '',
      onEnter: () => {
        document.title = 'Home';
      },
      component: Home
    },
    {
      name: 'not-found',
      uri: '.*',
      component: NotFound
    }
  ],
  errorComponent: ErrorPage
});
