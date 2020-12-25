const classNames = require('classnames');
const {Link, RouterView, getRouter} = require('@benson.liao/capybara-router');
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
      router.listen('ChangeSuccess', (action, toState) => {
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
    const {currentRouteName} = this.state;
    return (
      <>
        {/* Left menu */}
        <div className="left-menu fixed-top">
          <h2>{i18n.t('navigation.sidebar.internetNetworkSettings')}</h2>
          <nav className="nav flex-column">
            <Link
              to="/network/settings"
              title={i18n.t('navigation.sidebar.network')}
              className={classNames('nav-link', {active: currentRouteName === 'web.network.settings'})}
            >
              {i18n.t('navigation.sidebar.network')}
            </Link>
            <Link
              to="/network/tcp-ip"
              title={i18n.t('navigation.sidebar.tcpip')}
              className={classNames('nav-link', {active: currentRouteName === 'web.network.tcp-ip'})}
            >
              {i18n.t('navigation.sidebar.tcpip')}
            </Link>
            <Link
              to="/network/https"
              title={i18n.t('navigation.sidebar.https')}
              className={classNames('nav-link', {active: currentRouteName === 'web.network.https'})}
            >
              {i18n.t('navigation.sidebar.https')}
            </Link>
          </nav>
        </div>

        {/* Main content */}
        <RouterView><Loading/></RouterView>
      </>
    );
  }
};
