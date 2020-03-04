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
const {RouterView} = require('capybara-router');
const progress = require('nprogress');
const dayjs = require('dayjs');
const LocalizedFormat = require('dayjs/plugin/localizedFormat');
const dayjsZhTW = require('dayjs/locale/zh-tw');
const dayjsZhCN = require('dayjs/locale/zh-cn');
const dayjsEs = require('dayjs/locale/es');
const dayjsJa = require('dayjs/locale/ja');
const elementResizeDetectorMaker = require('element-resize-detector');
const React = require('react');
const ReactDOM = require('react-dom');
const ReactNotification = require('react-notifications-component').default;
const router = require('./router');
const store = require('../core/store');
const Loading = require('../core/components/loading');
const api = require('../core/apis/web-api');

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/assets/service-worker.js', {scope: '/'});
}

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// Setup nprogress
progress.configure({
  showSpinner: false
});

dayjs.extend(LocalizedFormat);
switch (window.currentLanguageCode) {
  case 'zh-tw':
    dayjs.locale('zh-tw', dayjsZhTW);
    break;
  case 'zh-cn':
    dayjs.locale('zh-cn', dayjsZhCN);
    break;
  case 'ja-jp':
    dayjs.locale('ja', dayjsJa);
    break;
  case 'es-es':
    dayjs.locale('es', dayjsEs);
    break;
  default:
}

// Setup initial data
store.set('$user', window.user);
store.set('$erd', elementResizeDetectorMaker());

const waitForReboot = () => {
  const ping = () => {
    return api.ping()
      .then(() => {
        location.reload();
      })
      .catch(() => {
        setTimeout(ping, 1000);
      });
  };

  ping();
  ReactDOM.render(<Loading/>, document.getElementById('root'));
};

const renderWeb = () => {
  // Setup routers
  router.listen('ChangeStart', (action, toState, fromState, cancel) => {
    progress.start();
    if (window.error) {
      // Backend need we render the error page.
      cancel();
      setTimeout(() => {
        progress.done();
        router.renderError(window.error);
      });
      return;
    }

    const $user = store.get('$user');
    const allowAnonymousRoutes = [
      'setup',
      'login',
      'login-lock',
      'forgot-password',
      'reset-password',
      'reset-password-success',
      'not-found'
    ];
    if (!$user && allowAnonymousRoutes.indexOf(toState.name) < 0) {
      cancel();
      Cookies.set(window.config.cookies.redirect, JSON.stringify(toState));
      setTimeout(() => {
        router.go('/login', {replace: true});
      });
    }
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
  router.listen('ChangeError', progress.done);
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
