const classNames = require('classnames');
const React = require('react');
const {RouterView, Link, getRouter} = require('capybara-router');
const Loading = require('../../../core/components/loading');
const _ = require('../../../languages');
const Base = require('../shared/base');

module.exports = class Smart extends Base {
  constructor(props) {
    super(props);
    const router = getRouter();

    this.state.currentRouteName = router.currentRoute.name;
    this.$listens.push(
      router.listen('ChangeStart', (action, toState) => {
        this.setState({
          currentRouteName: toState.name
        });
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
          <h2>{_('Analytic')}</h2>
          <nav className="nav flex-column">
            <Link to="/analytic/face-recognition" title={_('Face recognition')}
              className={classNames('nav-link', {active: currentRouteName === 'web.smart.face-recognition'})}
            >
              {_('Face recognition')}
            </Link>
            <Link to="/analytic/motion-detection" title={_('Motion detection')}
              className={classNames('nav-link', {active: currentRouteName === 'web.smart.motion-detection'})}
            >
              {_('Motion detection')}
            </Link>
            <Link to="/analytic/license" title={_('License')}
              className={classNames('nav-link', {active: currentRouteName === 'web.smart.license'})}
            >
              {_('License')}
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
