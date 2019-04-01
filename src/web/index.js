// Style
require('@fortawesome/fontawesome-free/css/all.css');
require('webserver-prototype/src/style/main.scss');

// Dependence
require('babel-polyfill');
require('jquery/dist/jquery');
require('bootstrap/dist/js/bootstrap.bundle');

const Cookies = require('js-cookie');
const {RouterView} = require('capybara-router');
const progress = require('nprogress');
const React = require('react');
const ReactDOM = require('react-dom');
const router = require('./router');
const store = require('../core/store');

// Setup nprogress
progress.configure({
  showSpinner: false
});

// Setup initial data
store.set('$config', window.config);
store.set('$user', window.user);

// Setup routers
router.listen('ChangeStart', (action, toState, fromState, cancel) => {
  progress.start();
  const $user = store.get('$user');
  const $config = store.get('$config');
  // if (!$user.id && ['web.login'].indexOf(toState.name) < 0) {
  //   cancel();
  //   Cookies.set($config.cookie.redirect, JSON.stringify(toState));
  //   setTimeout(() => {
  //     router.go({name: 'web.login'});
  //   });
  // }
});
router.listen('ChangeSuccess', () => progress.done());
router.listen('ChangeError', () => progress.done());
router.start();

ReactDOM.render((
  <RouterView>
    <p className="text-center text-muted h3" style={{padding: '20px 0'}}>
      <i className="fas fa-spinner fa-pulse fa-fw"/> Loading...
    </p>
  </RouterView>
), document.getElementById('root'));
