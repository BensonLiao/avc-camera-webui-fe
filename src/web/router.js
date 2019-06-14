/* eslint-disable capitalized-comments */
const {Router} = require('capybara-router');
const history = require('history');

module.exports = new Router({
  history: history.createBrowserHistory(),
  routes: [
    {
      name: 'web',
      uri: '',
      isAbstract: true,
      component: require('./pages/layout')
    },
    {
      name: 'web.home',
      uri: '/',
      onEnter: () => {
        document.title = 'Home - [Camera name] Web-Manager';
      },
      component: require('./pages/home')
    },
    {
      name: 'login',
      uri: '/login',
      onEnter: () => {
        document.title = 'Login - [Camera name] Web-Manager';
      },
      loadComponent: () => import(
        /* webpackChunkName: "page-login" */
        './pages/account/login'
      )
    },
    {
      name: 'login-lock',
      uri: '/login-lock?loginLockExpiredTime',
      onEnter: () => {
        document.title = 'Login lock - [Camera name] Web-Manager';
      },
      loadComponent: () => import(
        /* webpackChunkName: "page-login-lock" */
        './pages/account/login-lock'
      )
    },
    {
      name: 'not-found',
      uri: '.*',
      component: require('./pages/shared/not-found')
    }
  ],
  errorComponent: require('./pages/shared/error-page')
});
