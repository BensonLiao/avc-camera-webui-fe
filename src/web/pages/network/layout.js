const classNames = require('classnames');
const {Link, RouterView, getRouter} = require('capybara-router');
const React = require('react');
const Base = require('../shared/base');
const Loading = require('../../../core/components/loading');
const i18n = require('../../../i18n').default;

module.exports = class Network extends Base {
  constructor(props) {
    super(props);
    const router = getRouter();

    this.state.currentRouteName = router.currentRoute.name;
    this.$listens.push(
      router.listen('ChangeStart', (action, toState) => {
        this.setState({currentRouteName: toState.name});
      })
    );
    if (this.state.currentRouteName === 'web.network') {
      setTimeout(() => {
        router.go({name: 'web.network.settings'});
      });
    }
  }

  render() {
    return (
      <>
        {/* Left menu */}
        <div className="left-menu fixed-top">
          <h2>{i18n.t('Internet & Network Settings')}</h2>
          <nav className="nav flex-column">
            <Link
              to="/network/settings"
              title="Network Settings"
              className={classNames('nav-link', {active: this.state.currentRouteName === 'web.network.settings'})}
            >
              {i18n.t('Network')}
            </Link>
            <Link
              to="/network/tcp-ip"
              title="TCP/IP"
              className={classNames('nav-link', {active: this.state.currentRouteName === 'web.network.tcp-ip'})}
            >
              TCP/IP
            </Link>
            <Link
              to="/network/https"
              title="HTTPS"
              className={classNames('nav-link', {active: this.state.currentRouteName === 'web.network.https'})}
            >
              {i18n.t('HTTPS')}
            </Link>
          </nav>
        </div>

        {/* Main content */}
        <RouterView><Loading/></RouterView>
      </>
    );
  }
};
