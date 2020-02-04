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
      name: 'web.media',
      uri: '/media',
      onEnter: () => {
        document.title = `${_('Multimedia settings')} - ${_title}`;
      },
      loadComponent: () => import(
        /* webpackChunkName: "page-media" */
        './pages/media/layout'
      )
    },
    {
      name: 'web.media.stream',
      uri: '/stream',
      onEnter: () => {
        document.title = `${_('Stream settings')} - ${_('Multimedia settings')} - ${_title}`;
      },
      resolve: {
        streamSettings: () => api.multimedia.getStreamSettings().then(response => response.data)
      },
      loadComponent: () => import(
        /* webpackChunkName: "page-media" */
        './pages/media/stream'
      )
    },
    {
      name: 'web.media.privacy-mask',
      uri: '/privacy-mask',
      onEnter: () => {
        document.title = `${_('Privacy mask')} - ${_('Multimedia settings')} - ${_title}`;
      },
      resolve: {
        privacyMaskSettings: () => api.multimedia.getPrivacyMaskSettings().then(response => response.data)
      },
      loadComponent: () => import(
        /* webpackChunkName: "page-media" */
        './pages/media/privacy-mask'
      )
    },
    {
      name: 'web.media.audio',
      uri: '/audio',
      onEnter: () => {
        document.title = `${_('Audio settings')} - ${_('Multimedia settings')} - ${_title}`;
      },
      resolve: {
        audioSettings: () => api.multimedia.getAudioSettings().then(response => response.data)
      },
      loadComponent: () => import(
        /* webpackChunkName: "page-media" */
        './pages/media/audio'
      )
    },
    {
      name: 'web.media.rtsp',
      uri: '/rtsp',
      onEnter: () => {
        document.title = `${_('RTSP settings')} - ${_('Multimedia settings')} - ${_title}`;
      },
      resolve: {
        rtspSettings: () => api.multimedia.getRTSPSettings().then(response => response.data)
      },
      loadComponent: () => import(
        /* webpackChunkName: "page-media" */
        './pages/media/rtsp'
      )
    },
    {
      name: 'web.media.word',
      uri: '/word',
      onEnter: () => {
        document.title = `${_('Text stickers')} - ${_('Multimedia settings')} - ${_title}`;
      },
      resolve: {
        wordSettings: () => api.multimedia.getWordSettings().then(response => response.data)
      },
      loadComponent: () => import(
        /* webpackChunkName: "page-media" */
        './pages/media/word'
      )
    },
    {
      name: 'web.notification',
      uri: '/notification',
      onEnter: () => {
        document.title = `${_('Notification settings')} - ${_title}`;
      },
      loadComponent: () => import(
        /* webpackChunkName: "page-notification" */
        './pages/notification/layout'
      )
    },
    {
      name: 'web.notification.app',
      uri: '/app',
      onEnter: () => {
        document.title = `${_('Notification settings')} - ${_title}`;
      },
      resolve: {
        appSettings: () => api.notification.getAppSettings().then(response => response.data)
      },
      loadComponent: () => import(
        /* webpackChunkName: "page-notification" */
        './pages/notification/app'
      )
    },
    {
      name: 'web.notification.smtp',
      uri: '/smtp',
      onEnter: () => {
        document.title = `${_('Notification settings')} - ${_title}`;
      },
      resolve: {
        smtpSettings: () => api.notification.getSMTPSettings().then(response => response.data)
      },
      loadComponent: () => import(
        /* webpackChunkName: "page-notification" */
        './pages/notification/smtp'
      )
    },
    {
      name: 'web.notification.io',
      uri: '/io',
      onEnter: () => {
        document.title = `${_('Notification settings')} - ${_title}`;
      },
      resolve: {
        ioInSettings: () => api.notification.getIOInSettings().then(response => response.data),
        ioOutASettings: () => api.notification.getIOOutSettings(0).then(response => response.data),
        ioOutBSettings: () => api.notification.getIOOutSettings(1).then(response => response.data)
      },
      loadComponent: () => import(
        /* webpackChunkName: "page-notification" */
        './pages/notification/io'
      )
    },
    {
      name: 'web.smart',
      uri: '/smart',
      onEnter: () => {
        document.title = `${_('Smart functions')} - ${_title}`;
      },
      loadComponent: () => import(
        /* webpackChunkName: "page-smart" */
        './pages/smart/layout'
      )
    },
    {
      name: 'web.smart.face-recognition',
      uri: '/face-recognition',
      onEnter: () => {
        document.title = `${_('Face recognition')} - ${_('Smart functions')} - ${_title}`;
      },
      resolve: {
        faceRecognitionSettings: () => api.smartFunction.getFaceRecognitionSettings().then(response => response.data)
      },
      loadComponent: () => import(
        /* webpackChunkName: "page-smart-face-recognition" */
        './pages/smart/face-recognition'
      )
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
      resolve: {
        isSetupSuccess: () => api.user.getUsers().then(response => response.data.items.some(item => item.account === 'admin'))
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
      name: 'not-found',
      uri: '.*',
      component: require('./pages/shared/not-found')
    }
  ],
  errorComponent: require('./pages/shared/error-page')
});
