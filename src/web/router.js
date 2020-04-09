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
        systemInformation: () => api.system.getInformation().then(response => response.data),
        networkSettings: () => api.system.getNetworkSettings().then(response => response.data),
        streamSettings: () => api.multimedia.getStreamSettings().then(response => response.data)
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
      name: 'web.image',
      uri: '/image',
      onEnter: () => {
        document.title = `${_('Image')} - ${_title}`;
      },
      resolve: {
        videoSettings: () => api.video.getSettings().then(response => response.data)
      },
      component: require('./pages/image')
    },
    {
      name: 'web.media',
      uri: '/media',
      onEnter: () => {
        document.title = `${_('Multimedia Settings')} - ${_title}`;
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
        document.title = `${_('Stream Settings')} - ${_('Multimedia Settings')} - ${_title}`;
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
        document.title = `${_('Privacy Mask')} - ${_('Multimedia Settings')} - ${_title}`;
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
      name: 'web.media.rtsp',
      uri: '/rtsp',
      onEnter: () => {
        document.title = `${_('Rtsp Settings')} - ${_('Multimedia Settings')} - ${_title}`;
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
        document.title = `${_('Text Stickers')} - ${_('Multimedia Settings')} - ${_title}`;
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
      name: 'web.audio',
      uri: '/audio',
      onEnter: () => {
        document.title = `${_('Audio Settings')} - ${_title}`;
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
      name: 'web.notification',
      uri: '/notification',
      onEnter: () => {
        document.title = `${_('Notification Settings')} - ${_title}`;
      },
      loadComponent: () => import(
        /* webpackChunkName: "page-notification" */
        './pages/notification/layout'
      )
    },
    {
      name: 'web.notification.smtp',
      uri: '/smtp',
      onEnter: () => {
        document.title = `${_('Notification Settings')} - ${_title}`;
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
        document.title = `${_('Notification Settings')} - ${_title}`;
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
      name: 'web.notification.cards',
      uri: '/cards',
      onEnter: () => {
        document.title = `${_('Notification Settings')} - ${_title}`;
      },
      resolve: {
        groups: () => api.group.getGroups().then(response => response.data),
        cards: () => api.notification.getCards().then(response => response.data)
      },
      loadComponent: () => import(
        /* webpackChunkName: "page-notification" */
        './pages/notification/cards'
      )
    },
    {
      name: 'web.smart',
      uri: '/analytic',
      onEnter: () => {
        document.title = `${_('Analytic')} - ${_title}`;
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
        document.title = `${_('Facial Recognition')} - ${_('Analytic')} - ${_title}`;
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
      name: 'web.smart.motion-detection',
      uri: '/motion-detection',
      onEnter: () => {
        document.title = `${_('Motion Detection')} - ${_('Analytic')} - ${_title}`;
      },
      resolve: {
        motionDetectionSettings: () => api.smartFunction.getMotionDetectionSettings().then(response => response.data)
      },
      loadComponent: () => import(
        /* webpackChunkName: "page-smart-motion-detection" */
        './pages/smart/motion-detection'
      )
    },
    {
      name: 'web.smart.license',
      uri: '/license',
      onEnter: () => {
        document.title = `${_('License')} - ${_('Analytic')} - ${_title}`;
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
      name: 'web.users',
      uri: '/users',
      onEnter: () => {
        document.title = `${_('User Management')} - ${_title}`;
      },
      loadComponent: () => import(
        /* webpackChunkName: "page-users" */
        './pages/members/layout'
      )
    },
    {
      name: 'web.users.members',
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
      name: 'web.users.members.details',
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
      name: 'web.users.members.new-member',
      uri: '/new',
      dismissalDelay: 300,
      onEnter: () => {
        document.title = `${_('New Member')} - ${_title}`;
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
      name: 'web.users.members.new-group',
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
      name: 'web.users.members.modify-group',
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
      name: 'web.users.accounts',
      uri: '/accounts',
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
      name: 'web.users.accounts.details',
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
      name: 'web.users.accounts.new-user',
      uri: '/new',
      dismissalDelay: 300,
      onEnter: () => {
        document.title = `${_('New User')} - ${_title}`;
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
      name: 'web.users.events',
      uri: '/events?keyword?index?sort?type?confidence?enrollStatus?start?end',
      onEnter: () => {
        document.title = `${_('Smart Search')} - ${_title}`;
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
      name: 'web.network',
      uri: '/network',
      onEnter: () => {
        document.title = `${_('Network')} - ${_title}`;
      },
      loadComponent: () => import(
        /* webpackChunkName: "page-network" */
        './pages/network/layout'
      )
    },
    {
      name: 'web.network.https',
      uri: '/https',
      onEnter: () => {
        document.title = `${_('Network')} - ${_title}`;
      },
      resolve: {
        httpsSettings: () => api.system.getHttpsSettings().then(response => response.data)
      },
      loadComponent: () => import(
        /* webpackChunkName: "page-network" */
        './pages/network/https'
      )
    },
    {
      name: 'web.system',
      uri: '/system',
      onEnter: () => {
        document.title = `${_('System')} - ${_title}`;
      },
      loadComponent: () => import(
        /* webpackChunkName: "page-system" */
        './pages/system/layout'
      )
    },
    {
      name: 'web.system.upgrade',
      uri: '/upgrade',
      onEnter: () => {
        document.title = `${_('System')} - ${_title}`;
      },
      loadComponent: () => import(
        /* webpackChunkName: "page-system" */
        './pages/system/upgrade'
      )
    },
    {
      name: 'web.system.maintain',
      uri: '/maintain',
      onEnter: () => {
        document.title = `${_('Device Maintain')} - ${_('System')} - ${_title}`;
      },
      loadComponent: () => import(
        /* webpackChunkName: "page-system" */
        './pages/system/maintain'
      )
    },
    {
      name: 'web.system.log',
      uri: '/log',
      onEnter: () => {
        document.title = `${_('System')} - ${_title}`;
      },
      loadComponent: () => import(
        /* webpackChunkName: "page-system" */
        './pages/system/log'
      )
    },
    {
      name: 'setup',
      uri: '/setup',
      onEnter: () => {
        document.title = `${_('Setup Account')} - ${_title}`;
      },
      loadComponent: () => import(
        /* webpackChunkName: "page-setup" */
        './pages/account/setup'
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
      name: 'login-error',
      uri: '/login-error?loginFailedRemainingTimes',
      onEnter: () => {
        document.title = `${_('Login Error')} - ${_title}`;
      },
      loadComponent: () => import(
        /* webpackChunkName: "page-login-error" */
        './pages/account/login-error'
      )
    },
    {
      name: 'login-lock',
      uri: '/login-lock?loginLockExpiredTime',
      onEnter: () => {
        document.title = `${_('Login Lock')} - ${_title}`;
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
