const classNames = require('classnames');
const React = require('react');
const {RouterView, Link, getRouter} = require('capybara-router');
const Loading = require('../../../core/components/loading');
const i18n = require('../../i18n').default;
const Base = require('../shared/base');

module.exports = class Smart extends Base {
  constructor() {
    super();
    const router = getRouter();

    this.state.currentRouteName = router.currentRoute.name;
    this.$listens.push(
      router.listen('ChangeStart', (action, toState) => {
        this.setState({currentRouteName: toState.name});
      })
    );
    if (this.state.currentRouteName === 'web.smart') {
      setTimeout(() => {
        router.go({name: 'web.smart.face-recognition'});
      });
    }
  }

  render() {
    const {currentRouteName} = this.state;

    return (
      <>
        {/* Left menu */}
        <div className="left-menu fixed-top">
          <h2>{i18n.t('Analytic')}</h2>
          <nav className="nav flex-column">
            <Link
              to="/analytic/face-recognition"
              title={i18n.t('Facial Recognition')}
              className={classNames('nav-link', {active: currentRouteName === 'web.smart.face-recognition'})}
            >
              {i18n.t('Facial Recognition')}
            </Link>
            <Link
              to="/analytic/motion-detection"
              title={i18n.t('Motion Detection')}
              className={classNames('nav-link', {active: currentRouteName === 'web.smart.motion-detection'})}
            >
              {i18n.t('Motion Detection')}
            </Link>
            <Link
              to="/analytic/license"
              title={i18n.t('License')}
              className={classNames('nav-link', {active: currentRouteName === 'web.smart.license'})}
            >
              {i18n.t('License')}
            </Link>
          </nav>
        </div>

        <div className="main-content left-menu-active">
          <RouterView><Loading/></RouterView>
        </div>
      </>
    );
  }
};
