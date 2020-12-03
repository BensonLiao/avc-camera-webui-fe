// Style
require('@fortawesome/fontawesome-free/css/all.css');
require('bootstrap-slider/dist/css/bootstrap-slider.css');
require('nprogress/nprogress.css');
require('react-notifications-component/dist/theme.css');
require('animate.css/animate.css');
require('../style/main.scss');

// Dependence
require('@babel/polyfill');
require('jquery/dist/jquery');
require('bootstrap/dist/js/bootstrap.bundle');

const Cookies = require('js-cookie');
const {RouterView} = require('@benson.liao/capybara-router');
const progress = require('nprogress');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc'); // dependent on utc plugin
const timezone = require('dayjs/plugin/timezone');
const LocalizedFormat = require('dayjs/plugin/localizedFormat');
const elementResizeDetectorMaker = require('element-resize-detector');
const React = require('react');
const ReactDOM = require('react-dom');
const ReactNotification = require('react-notifications-component').default;
const SimpleCrypto = require('simple-crypto-js').default;
const UserPermission = require('webserver-form-schema/constants/user-permission');
const CertificateType = require('webserver-form-schema/constants/certificate-type');
const router = require('./router');
const store = require('../core/store');
const Loading = require('../core/components/loading');
const api = require('../core/apis/web-api');
const utils = require('../core/utils');
const config = require('../../config/default');
require('../i18n');
// We have to manually load all supported locale module except dayjs default for now, otherwise webpack will throw a warning
require('dayjs/locale/es');
require('dayjs/locale/ja');
require('dayjs/locale/zh-cn');
require('dayjs/locale/zh-tw');

const simpleCrypto = new SimpleCrypto(SimpleCrypto.generateRandom);
window.rootPassword = simpleCrypto.encrypt(config.rootPassword);

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// Setup nprogress
progress.configure({showSpinner: false});

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(LocalizedFormat);
dayjs.locale(window.currentLanguageCode);

// Setup initial data
store.set('$user', window.user);
store.set('$setup', {
  language: window.currentLanguageCode,
  account: {
    permission: UserPermission.root,
    account: '',
    birthday: '',
    password: '',
    confirmPassword: ''
  },
  https: {
    certificateType: CertificateType.selfSigned,
    certificate: '',
    privateKey: '',
    country: '',
    state: '',
    city: '',
    organization: '',
    organizationUnit: '',
    email: '',
    domain: ''
  }
});

store.set('$erd', elementResizeDetectorMaker());

const waitForReboot = () => {
  utils.pingToCheckStartupAndReload(1000);
  ReactDOM.render(<Loading/>, document.getElementById('root'));
};

const renderWeb = () => {
  // Setup routers
  router.listen('ChangeStart', (action, toState, fromState, next) => {
    progress.start();
    if (window.error) {
      // Backend need we render the error page.
      setTimeout(() => {
        progress.done();
        router.renderError(window.error);
      });
      return;
    }

    // if (toState.name === 'setup-https' && !store.get('$setup').account.account) {
    //   cancel();
    //   setTimeout(() => {
    //     router.go('/setup/account', {replace: true});
    //   });
    //   return;
    // }

    const $user = store.get('$user');
    const allowAnonymousRoutes = [
      'setup-https',
      'setup-account',
      'setup-language',
      'setup-welcome',
      'login',
      'login-lock',
      'login-error',
      'not-found'
    ];
    const allowGuestRoutes = [
      'web',
      'web.home'
    ];
    if (!$user && allowAnonymousRoutes.indexOf(toState.name) < 0) {
      Cookies.set(window.config.cookies.redirect, JSON.stringify(toState));
      setTimeout(() => {
        router.go('/login', {replace: true});
      });
      return;
    }

    if (
      $user &&
      $user.permission === '1' &&
      allowAnonymousRoutes.indexOf(toState.name) < 0 &&
      allowGuestRoutes.indexOf(toState.name) < 0
    ) {
      Cookies.set(window.config.cookies.redirect, JSON.stringify(toState));
      setTimeout(() => {
        router.go('/', {replace: true});
      });
      return;
    }

    // we must call next on ChangeStart listener
    next();
  });
  router.listen('ChangeSuccess', (action, toState, fromState) => {
    progress.done();
    if (['PUSH', 'REPLACE', 'POP'].indexOf(action) >= 0) {
      if (
        toState.name === 'web.members.details' ||
        toState.name === 'web.members.new-member' ||
        toState.name === 'web.members.new-group' ||
        toState.name === 'web.members.modify-group' ||
        (toState.name === 'web.members' && [
          'web.members.details',
          'web.members.new-member',
          'web.members.new-group',
          'web.members.modify-group'
        ].indexOf(fromState.name) >= 0)
      ) {
        return;
      }

      if (
        toState.name === 'web.security.users.details' ||
        toState.name === 'web.security.users.new-user' ||
        (toState.name === 'web.security.users' && [
          'web.security.users.details',
          'web.security.users.new-user'
        ].indexOf(fromState.name) >= 0)
      ) {
        return;
      }

      if (typeof window.scrollTo === 'function') {
        window.scrollTo(0, 0);
      }
    } else if (action === 'RELOAD') {
      if (typeof window.scrollTo === 'function') {
        window.scrollTo(0, 0);
      }
    }
  });
  router.listen('ChangeError', err => {
    console.error('Router change error: ', err);
    progress.done();
  });
  router.start();

  ReactDOM.render(
    <>
      <ReactNotification/>
      <RouterView><Loading/></RouterView>
    </>,
    document.getElementById('root')
  );
};

api.ping()
  .then(renderWeb)
  .catch(waitForReboot);
