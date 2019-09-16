// Style
require('@fortawesome/fontawesome-free/css/all.css');
require('webserver-prototype/src/style/main.scss');
require('nprogress/nprogress.css');

// Dependence
require('@babel/polyfill');
require('jquery/dist/jquery');
require('bootstrap/dist/js/bootstrap.bundle');

const Cookies = require('js-cookie');
const {RouterView} = require('capybara-router');
const progress = require('nprogress');
const React = require('react');
const ReactDOM = require('react-dom');
const router = require('./router');
const store = require('../core/store');
const Loading = require('../core/components/loading');
const _ = require('../languages');

// Setup nprogress
progress.configure({
  showSpinner: false
});

// Setup initial data
store.set('$user', window.user);
store.set('$setup', {
  language: window.currentLanguageCode,
  account: {
    permission: 'admin',
    account: '',
    birthday: '',
    password: '',
    confirmPassword: ''
  },
  https: {
    certificateType: 'self-sign',
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
  const allowAnonymousRoutes = ['login', 'login-lock', 'not-found'];
  if (!$user && allowAnonymousRoutes.indexOf(toState.name) < 0) {
    cancel();
    Cookies.set(window.config.cookies.redirect, JSON.stringify(toState));
    setTimeout(() => {
      router.go('/login', {replace: true});
    });
  }
});
router.listen('ChangeSuccess', action => {
  progress.done();
  if (action === 'PUSH') {
    try {
      window.scrollTo(0, 0);
    } catch (e) {}
  }
});
router.listen('ChangeError', progress.done);
router.start();

ReactDOM.render(
  <RouterView><Loading/></RouterView>,
  document.getElementById('root')
);
