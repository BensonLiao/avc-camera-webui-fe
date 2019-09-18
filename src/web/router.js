/* eslint-disable capitalized-comments */
const {Router} = require('capybara-router');
const history = require('history');
const _ = require('../languages');
const api = require('../core/apis/web-api');

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
      resolve: {
        status: () => api.system.getStatus().then(response => response.data)
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
      name: 'reset-password',
      uri: '/reset-password?account?birthday',
      onEnter: () => {
        document.title = `${_('Reset password')} - ${_title}`;
      },
      loadComponent: () => import(
        /* webpackChunkName: "page-reset-password" */
        './pages/account/reset-password'
      )
    },
    {
      name: 'reset-password-success',
      uri: '/reset-password-success',
      onEnter: () => {
        document.title = `${_('Reset password success.')} - ${_title}`;
      },
      loadComponent: () => import(
        /* webpackChunkName: "page-reset-password-success" */
        './pages/account/reset-password-success'
      )
    },
    {
      name: 'setup-welcome',
      uri: '/setup',
      onEnter: () => {
        document.title = `${_('Welcome')} - ${_title}`;
      },
      loadComponent: () => import(
        /* webpackChunkName: "page-setup-welcome" */
        './pages/setup/welcome'
      )
    },
    {
      name: 'setup-language',
      uri: '/setup/language',
      onEnter: () => {
        document.title = `${_('Setup language')} - ${_title}`;
      },
      loadComponent: () => import(
        /* webpackChunkName: "page-setup-language" */
        './pages/setup/language'
      )
    },
    {
      name: 'setup-account',
      uri: '/setup/account',
      onEnter: () => {
        document.title = `${_('Setup account')} - ${_title}`;
      },
      loadComponent: () => import(
        /* webpackChunkName: "page-setup-account" */
        './pages/setup/account'
      )
    },
    {
      name: 'setup-https',
      uri: '/setup/https',
      onEnter: () => {
        document.title = `${_('Setup HTTPS')} - ${_title}`;
      },
      loadComponent: () => import(
        /* webpackChunkName: "page-setup-https" */
        './pages/setup/https'
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
