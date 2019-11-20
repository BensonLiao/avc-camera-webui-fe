const classNames = require('classnames');
const React = require('react');
const {RouterView, Link, getRouter} = require('capybara-router');
const Base = require('../shared/base');
const _ = require('../../../languages');

module.exports = class Security extends Base {
  constructor(props) {
    super(props);
    const router = getRouter();
    this.state.currentRouteUri = router.currentRoute.uriTemplate;
    this.$listens.push(
      router.listen('ChangeStart', (action, toState) => {
        const currentRouteUri = router.findRouteByName(toState.name).uriTemplate;
        this.setState({
          currentRouteUri: currentRouteUri
        });
      })
    );
  }

  render() {
    return (
      <>
        {/* Left menu */}
        <div className="left-menu fixed-top">
          <h2>{_('Security')}</h2>
          <nav className="nav flex-column">
            <Link to="/security/account" title={_('All members')}
              className={classNames('nav-link', {active: this.state.currentRouteUri === '/security/account'})}
            >
              帳號設定
            </Link>
            <Link to="/security/https" title={_('All members')}
              className={classNames('nav-link', {active: this.state.currentRouteUri === '/security/https'})}
            >
              HTTPS
            </Link>
          </nav>
        </div>

        {/* Main content */}
        <RouterView/>
      </>
    );
  }
};
