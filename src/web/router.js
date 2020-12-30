const {Router} = require('@benson.liao/capybara-router');
const dayjs = require('dayjs');
const history = require('history');
const i18n = require('../i18n').default;

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
        networkSettings: () => api.system.getNetworkSettings().then(response => response.data)
      },
      component: require('./pages/layout')
    },
    {
      name: 'adbconfig',
      uri: '/adbconfig?enable',
      component: require('./pages/adbconfig')
    },
    {
      name: 'mjpeg',
      uri: '/mjpeg?res?quality',
      loadComponent: () => import(
        './pages/mjpeg'
      )
    },
    {
      name: 'h264',
      uri: '/h264?res?qp?fps?bitrate?iframe',
      loadComponent: () => import(
        './pages/h264'
      )
    },
    {
      name: 'web.home',
      uri: '/',
      onEnter: () => {
        document.title = `${i18n.t('documentTitle.home')} - ${_title}`;
      },
      resolve: {
        videoSettings: () => api.video.getSettings().then(response => response.data),
        streamSettings: () => api.multimedia.getStreamSettings().then(response => response.data),
        systemDateTime: () => api.system.getSystemDateTime().then(response => response.data),
        authStatus: () => api.authKey.getAuthStatus().then(response => response.data),
        faceRecognitionStatus: () => api.smartFunction.getFaceRecognitionStatus().then(response => response.data)
      },
      component: require('./pages/home')
    },
    {
      name: 'web.media',
      uri: '/media',
      onEnter: () => {
        document.title = `${i18n.t('documentTitle.videoSettings')} - ${_title}`;
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
        document.title = `${i18n.t('documentTitle.streams')} - ${i18n.t('documentTitle.videoSettings')} - ${_title}`;
      },
      resolve: {streamSettings: () => api.multimedia.getStreamSettings().then(response => response.data)},
      loadComponent: () => import(
        /* webpackChunkName: "page-media" */
        './pages/media/stream'
      )
    },
    {
      name: 'web.media.privacy-mask',
      uri: '/privacy-mask',
      onEnter: () => {
        document.title = `${i18n.t('documentTitle.privacyMask')} - ${i18n.t('documentTitle.videoSettings')} - ${_title}`;
      },
      resolve: {privacyMaskSettings: () => api.multimedia.getPrivacyMaskSettings().then(response => response.data)},
      loadComponent: () => import(
        /* webpackChunkName: "page-media" */
        './pages/media/privacy-mask'
      )
    },
    {
      name: 'web.media.rtsp',
      uri: '/rtsp',
      onEnter: () => {
        document.title = `${i18n.t('documentTitle.rtsp')} - ${i18n.t('documentTitle.videoSettings')} - ${_title}`;
      },
      resolve: {
        rtspSettings: () => api.multimedia.getRTSPSettings().then(response => response.data),
        httpInfo: () => api.system.getHttpInfo().then(response => response.data),
        httpsSettings: () => api.system.getHttpsSettings().then(response => response.data)
      },
      loadComponent: () => import(
        /* webpackChunkName: "page-media" */
        './pages/media/rtsp'
      )
    },
    {
      name: 'web.media.hdmi',
      uri: '/hdmi',
      onEnter: () => {
        document.title = `${i18n.t('documentTitle.hdmi')} - ${i18n.t('documentTitle.videoSettings')} - ${_title}`;
      },
      resolve: {hdmiSettings: () => api.multimedia.getHDMISettings().then(response => response.data)},
      loadComponent: () => import(
        /* webpackChunkName: "page-media" */
        './pages/media/hdmi'
      )
    },
    {
      name: 'web.media.osd',
      uri: '/osd',
      onEnter: () => {
        document.title = `${i18n.t('documentTitle.osd')} - ${i18n.t('documentTitle.videoSettings')} - ${_title}`;
      },
      resolve: {osdSettings: () => api.multimedia.getOSDSettings().then(response => response.data)},
      loadComponent: () => import(
        /* webpackChunkName: "page-media" */
        './pages/media/osd'
      )
    },
    {
      name: 'web.audio',
      uri: '/audio',
      onEnter: () => {
        document.title = `${i18n.t('documentTitle.audio')} - ${_title}`;
      },
      resolve: {audioSettings: () => api.multimedia.getAudioSettings().then(response => response.data)},
      loadComponent: () => import(
        /* webpackChunkName: "page-media" */
        './pages/media/audio'
      )
    },
    {
      name: 'web.notification',
      uri: '/notification',
      onEnter: () => {
        document.title = `${i18n.t('documentTitle.notification')} - ${_title}`;
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
        document.title = `${i18n.t('documentTitle.email')} - ${i18n.t('documentTitle.notification')} - ${_title}`;
      },
      resolve: {smtpSettings: () => api.notification.getSMTPSettings().then(response => response.data)},
      loadComponent: () => import(
        /* webpackChunkName: "page-notification" */
        './pages/notification/smtp'
      )
    },
    {
      name: 'web.notification.io',
      uri: '/io',
      onEnter: () => {
        document.title = `${i18n.t('documentTitle.io')} - ${i18n.t('documentTitle.notification')} - ${_title}`;
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
        document.title = `${i18n.t('documentTitle.smartNotification')} - ${i18n.t('documentTitle.notification')} - ${_title}`;
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
        document.title = `${i18n.t('documentTitle.analyticsSettings')} - ${_title}`;
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
        document.title = `${i18n.t('documentTitle.facialRecognition')} - ${i18n.t('documentTitle.analyticsSettings')} - ${_title}`;
      },
      resolve: {faceRecognitionSettings: () => api.smartFunction.getFaceRecognitionSettings().then(response => response.data)},
      loadComponent: () => import(
        /* webpackChunkName: "page-smart-face-recognition" */
        './pages/smart/face-recognition'
      )
    },
    {
      name: 'web.smart.motion-detection',
      uri: '/motion-detection',
      onEnter: () => {
        document.title = `${i18n.t('documentTitle.motionDetection')} - ${i18n.t('documentTitle.analyticsSettings')} - ${_title}`;
      },
      resolve: {motionDetectionSettings: () => api.smartFunction.getMotionDetectionSettings().then(response => response.data)},
      loadComponent: () => import(
        /* webpackChunkName: "page-smart-motion-detection" */
        './pages/smart/motion-detection'
      )
    },
    {
      name: 'web.smart.license',
      uri: '/license',
      onEnter: () => {
        document.title = `${i18n.t('documentTitle.license')} - ${i18n.t('documentTitle.analyticsSettings')} - ${_title}`;
      },
      resolve: {
        authKeys: () => api.authKey.getAuthKeys().then(response => response.data),
        authStatus: () => api.authKey.getAuthStatus().then(response => response.data)
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
        document.title = `${i18n.t('documentTitle.userManagement')} - ${_title}`;
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
        document.title = `${i18n.t('documentTitle.members')} - ${_title}`;
      },
      resolve: {
        groups: () => api.group.getGroups().then(response => response.data),
        members: params => api.member.getMembers(params).then(response => response.data),
        remainingPictureCount: () => api.member.remainingPictureCount().then(response => response.data),
        deviceSync: () => api.member.getDevice().then(response => response.data)
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
        document.title = `${i18n.t('documentTitle.members')} - ${_title}`;
      },
      resolve: {
        member: params => api.member.getMember(params.memberId).then(response => response.data),
        remainingPictureCount: () => api.member.remainingPictureCount().then(response => response.data)
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
        document.title = `${i18n.t('documentTitle.newMember')} - ${_title}`;
      },
      resolve: {member: () => null},
      loadComponent: () => import(
        /* webpackChunkName: "page-member" */
        './pages/members/member'
      )
    },
    {
      name: 'web.users.members.new-group',
      uri: '/new-group',
      onEnter: () => {
        document.title = `${i18n.t('documentTitle.members')} - ${_title}`;
      },
      resolve: {group: () => null},
      loadComponent: () => import(
        /* webpackChunkName: "page-group" */
        './pages/members/group'
      )
    },
    {
      name: 'web.users.members.modify-group',
      uri: '/modify-group',
      onEnter: () => {
        document.title = `${i18n.t('documentTitle.members')} - ${_title}`;
      },
      resolve: {group: params => api.group.getGroup(params.group).then(response => response.data)},
      loadComponent: () => import(
        /* webpackChunkName: "page-group" */
        './pages/members/group'
      )
    },
    {
      name: 'web.users.accounts',
      uri: '/accounts',
      onEnter: () => {
        document.title = `${i18n.t('documentTitle.accounts')} - ${_title}`;
      },
      resolve: {users: () => api.user.getUsers().then(response => response.data)},
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
        document.title = `${i18n.t('documentTitle.accounts')} - ${_title}`;
      },
      resolve: {user: params => api.user.getUser(params.userId).then(response => response.data)},
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
        document.title = `${i18n.t('documentTitle.newUser')} - ${_title}`;
      },
      resolve: {user: () => null},
      loadComponent: () => import(
        /* webpackChunkName: "page-security" */
        './pages/security/user'
      )
    },
    {
      name: 'web.users.events',
      uri: '/events?keyword?index?sort?type?confidence?enrollStatus?start?end',
      onEnter: () => {
        document.title = `${i18n.t('documentTitle.events')} - ${_title}`;
      },
      resolve: {
        faceEvents: params => api.event.getFaceEvents(params).then(response => response.data),
        groups: () => api.group.getGroups().then(response => response.data),
        authStatus: () => api.authKey.getAuthStatus().then(response => response.data),
        systemDateTime: () => api.system.getSystemDateTime().then(response => response.data),
        remainingPictureCount: () => api.member.remainingPictureCount().then(response => response.data)
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
        document.title = `${i18n.t('documentTitle.network')} - ${_title}`;
      },
      loadComponent: () => import(
        /* webpackChunkName: "page-network" */
        './pages/network/layout'
      )
    },
    {
      name: 'web.network.settings',
      uri: '/settings',
      onEnter: () => {
        document.title = `${i18n.t('documentTitle.network')} - ${i18n.t('documentTitle.internetNetworkSettings')} - ${_title}`;
      },
      resolve: {networkSettings: () => api.system.getNetworkSettings().then(response => response.data)},
      loadComponent: () => import(
        /* webpackChunkName: "page-network" */
        './pages/network/settings'
      )
    },
    {
      name: 'web.network.tcp-ip',
      uri: '/tcp-ip',
      onEnter: () => {
        document.title = `${i18n.t('documentTitle.tcpip')} - ${i18n.t('documentTitle.internetNetworkSettings')} - ${_title}`;
      },
      resolve: {
        ddnsInfo: () => api.system.getDDNSInfo().then(response => response.data),
        httpInfo: () => api.system.getHttpInfo().then(response => response.data),
        rtspSettings: () => api.multimedia.getRTSPSettings().then(response => response.data),
        httpsSettings: () => api.system.getHttpsSettings().then(response => response.data)
      },
      loadComponent: () => import(
        /* webpackChunkName: "page-network" */
        './pages/network/tcp-ip'
      )
    },
    {
      name: 'web.network.https',
      uri: '/https',
      onEnter: () => {
        document.title = `${i18n.t('documentTitle.https')} - ${i18n.t('documentTitle.internetNetworkSettings')} - ${_title}`;
      },
      resolve: {
        httpsSettings: () => api.system.getHttpsSettings().then(response => response.data),
        httpInfo: () => api.system.getHttpInfo().then(response => response.data),
        rtspSettings: () => api.multimedia.getRTSPSettings().then(response => response.data)
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
        document.title = `${i18n.t('documentTitle.system')} - ${_title}`;
      },
      loadComponent: () => import(
        /* webpackChunkName: "page-system" */
        './pages/system/layout'
      )
    },
    {
      name: 'web.system.datetime',
      uri: '/datetime',
      onEnter: () => {
        document.title = `${i18n.t('documentTitle.dateTime')} - ${i18n.t('documentTitle.system')} - ${_title}`;
      },
      resolve: {systemDateTime: () => api.system.getSystemDateTime().then(response => response.data)},
      loadComponent: () => import(
        /* webpackChunkName: "page-system" */
        './pages/system/datetime'
      )
    },
    {
      name: 'web.system.upgrade',
      uri: '/upgrade',
      onEnter: () => {
        document.title = `${i18n.t('documentTitle.softwareUpgrade')} - ${i18n.t('documentTitle.system')} - ${_title}`;
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
        document.title = `${i18n.t('documentTitle.deviceMaintenance')} - ${i18n.t('documentTitle.system')} - ${_title}`;
      },
      loadComponent: () => import(
        /* webpackChunkName: "page-system" */
        './pages/system/maintain'
      )
    },
    {
      name: 'web.sd-card',
      uri: '/sd-card',
      onEnter: () => {
        document.title = `${i18n.t('documentTitle.sdCardSettings')} - ${_title}`;
      },
      loadComponent: () => import(
        /* webpackChunkName: "page-sdcard" */
        './pages/sdcard/layout'
      )
    },
    {
      name: 'web.sd-card.settings',
      uri: '/settings',
      onEnter: () => {
        document.title = `${i18n.t('documentTitle.sdCardSettings')} - ${_title}`;
      },
      resolve: {
        smtpSettings: () => api.notification.getSMTPSettings().then(response => response.data),
        sdCardRecordingSettings: () => api.system.getSDCardRecordingSettings().then(response => response.data),
        streamSettings: () => api.multimedia.getStreamSettings().then(response => response.data)
      },
      loadComponent: () => import(
        /* webpackChunkName: "page-sd-card" */
        './pages/sdcard/sd-card'
      )
    },
    {
      name: 'web.sd-card.storage',
      uri: '/storage',
      onEnter: () => {
        document.title = `${i18n.t('documentTitle.sdCardStorage')} - ${_title}`;
      },
      resolve: {
        storage: () => {
          const date = dayjs();
          return api.system.getSDCardStorageFiles(date.format('YYYY-MM-DD'))
            .then(response => {
              return {
                files: response.data,
                date
              };
            });
        },
        dateList: () => api.system.getSDCardStorageDateList().then(response => response.data)
      },
      loadComponent: () => import(
        /* webpackChunkName: "page-sd-card" */
        './pages/sdcard/sd-card-storage'
      )
    },
    {
      name: 'web.system.log',
      uri: '/log',
      onEnter: () => {
        document.title = `${i18n.t('documentTitle.systemLog')} - ${i18n.t('documentTitle.system')} - ${_title}`;
      },
      loadComponent: () => import(
        /* webpackChunkName: "page-system" */
        './pages/system/log'
      )
    },
    {
      name: 'web.system.information',
      uri: '/information',
      onEnter: () => {
        document.title = `${i18n.t('documentTitle.information')} - ${i18n.t('documentTitle.system')} - ${_title}`;
      },
      loadComponent: () => import(
        /* webpackChunkName: "page-system" */
        './pages/system/information'
      )
    },
    {
      name: 'setup-welcome',
      uri: '/setup',
      onEnter: () => {
        document.title = `${i18n.t('documentTitle.welcome')} - ${_title}`;
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
        document.title = `${i18n.t('documentTitle.language')} - ${_title}`;
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
        document.title = `${i18n.t('documentTitle.setupAccount')} - ${_title}`;
      },
      loadComponent: () => import(
        /* webpackChunkName: "page-setup-account" */
        './pages/setup/account'
      )
    },
    {
      name: 'login',
      uri: '/login',
      onEnter: () => {
        document.title = `${i18n.t('documentTitle.login')} - ${_title}`;
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
        document.title = `${i18n.t('documentTitle.loginError')} - ${_title}`;
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
        document.title = `${i18n.t('documentTitle.loginLocked')} - ${_title}`;
      },
      loadComponent: () => import(
        /* webpackChunkName: "page-login-lock" */
        './pages/account/login-lock'
      )
    },
    {
      name: 'not-found',
      uri: '.*',
      component: require('./pages/shared/not-found').default
    }
  ],
  errorComponent: require('./pages/shared/error-page').default
});
