/* eslint-disable capitalized-comments */
const {Router} = require('capybara-router');
const history = require('history');
const _ = require('../languages');

const _title = `${window.cameraName} Web-Manager`;

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
        document.title = `${_('Home')} - ${_title}`;
      },
      component: require('./pages/home')
    },
    {
      name: 'login',
      uri: '/login',
      onEnter: () => {
        document.title = `${_('Login')} - ${_title}`;
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
        document.title = `${_('Login lock')} - ${_title}`;
      },
      loadComponent: () => import(
        /* webpackChunkName: "page-login-lock" */
        './pages/account/login-lock'
      )
    },
    {
      name: 'forgot-password',
      uri: '/forgot-password',
      onEnter: () => {
        document.title = `${_('Forgot password')} - ${_title}`;
      },
      loadComponent: () => import(
        /* webpackChunkName: "page-forgot-password" */
        './pages/account/forgot-password'
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
