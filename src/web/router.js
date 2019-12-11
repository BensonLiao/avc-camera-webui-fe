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
      resolve: {
        systemInformation: () => api.system.getInformation().then(response => response.data)
      },
      component: require('./pages/layout')
    },
    {
      name: 'web.home',
      uri: '/',
      onEnter: () => {
        document.title = `${_('Home')} - ${_title}`;
      },
      resolve: {
        videoSettings: () => api.video.getSettings().then(response => response.data)
      },
      component: require('./pages/home')
    },
    {
      name: 'web.members',
      uri: '/members?group?keyword?index?sort',
      onEnter: () => {
        document.title = `${_('Members')} - ${_title}`;
      },
      resolve: {
        groups: () => api.group.getGroups().then(response => response.data),
        members: params => api.member.getMembers(params).then(response => response.data)
      },
      loadComponent: () => import(
        /* webpackChunkName: "page-members" */
        './pages/members/members'
      )
    },
    {
      name: 'web.members.details',
      uri: '/{memberId:[a-f0-9-]{36}}',
      dismissalDelay: 300,
      onEnter: () => {
        document.title = `${_('Member')} - ${_title}`;
      },
      resolve: {
        member: params => api.member.getMember(params.memberId).then(response => response.data)
      },
      loadComponent: () => import(
        /* webpackChunkName: "page-member" */
        './pages/members/member'
      )
    },
    {
      name: 'web.members.new-member',
      uri: '/new',
      dismissalDelay: 300,
      onEnter: () => {
        document.title = `${_('New member')} - ${_title}`;
      },
      resolve: {
        member: () => null
      },
      loadComponent: () => import(
        /* webpackChunkName: "page-member" */
        './pages/members/member'
      )
    },
    {
      name: 'web.members.new-group',
      uri: '/new-group',
      onEnter: () => {
        document.title = `${_('Members')} - ${_title}`;
      },
      resolve: {
        group: () => null
      },
      loadComponent: () => import(
        /* webpackChunkName: "page-group" */
        './pages/members/group'
      )
    },
    {
      name: 'web.members.modify-group',
      uri: '/modify-group',
      onEnter: () => {
        document.title = `${_('Members')} - ${_title}`;
      },
      resolve: {
        group: params => api.group.getGroup(params.group).then(response => response.data)
      },
      loadComponent: () => import(
        /* webpackChunkName: "page-group" */
        './pages/members/group'
      )
    },
    {
      name: 'web.security',
      uri: '/security',
      onEnter: () => {
        document.title = `${_('Security')} - ${_title}`;
      },
      loadComponent: () => import(
        /* webpackChunkName: "page-security" */
        './pages/security/layout'
      )
    },
    {
      name: 'web.security.users',
      uri: '/account',
      onEnter: () => {
        document.title = `${_('Security')} - ${_title}`;
      },
      resolve: {
        users: () => api.user.getUsers().then(response => response.data)
      },
      loadComponent: () => import(
        /* webpackChunkName: "page-security" */
        './pages/security/users'
      )
    },
    {
      name: 'web.security.users.details',
      uri: '/{userId:\\d+}',
      dismissalDelay: 300,
      onEnter: () => {
        document.title = `${_('Security')} - ${_title}`;
      },
      resolve: {
        user: params => api.user.getUser(params.userId).then(response => response.data)
      },
      loadComponent: () => import(
        /* webpackChunkName: "page-security" */
        './pages/security/user'
      )
    },
    {
      name: 'web.security.users.new-user',
      uri: '/new',
      dismissalDelay: 300,
      onEnter: () => {
        document.title = `${_('New user')} - ${_title}`;
      },
      resolve: {
        user: () => null
      },
      loadComponent: () => import(
        /* webpackChunkName: "page-security" */
        './pages/security/user'
      )
    },
    {
      name: 'web.security.https',
      uri: '/https',
      onEnter: () => {
        document.title = `${_('Security')} - ${_title}`;
      },
      resolve: {},
      loadComponent: () => import(
        /* webpackChunkName: "page-security" */
        './pages/security/https'
      )
    },
    {
      name: 'web.security.off-line',
      uri: '/off-line',
      onEnter: () => {
        document.title = `${_('Security')} - ${_title}`;
      },
      resolve: {},
      loadComponent: () => import(
        /* webpackChunkName: "page-security" */
        './pages/security/off-line'
      )
    },
    {
      name: 'web.events',
      uri: '/events?keyword?index?sort?type?confidence?enrollStatus?start?end',
      onEnter: () => {
        document.title = `${_('Smart search')} - ${_title}`;
      },
      resolve: {
        groups: params => {
          if ((params.type || 'face-recognition') !== 'face-recognition') {
            return null;
          }

          return api.group.getGroups().then(response => response.data);
        },
        faceEvents: params => {
          if ((params.type || 'face-recognition') !== 'face-recognition') {
            return null;
          }

          return api.event.getFaceEvents(params).then(response => response.data);
        }
      },
      loadComponent: () => import(
        /* webpackChunkName: "page-events" */
        './pages/events/events'
      )
    },
    {
      name: 'web.license',
      uri: '/license',
      onEnter: () => {
        document.title = `${_('License')} - ${_title}`;
      },
      resolve: {
        authKeys: () => api.authKey.getAuthKeys().then(response => response.data)
      },
      loadComponent: () => import(
        /* webpackChunkName: "page-license" */
        './pages/license/license'
      )
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
