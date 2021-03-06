const classNames = require('classnames');
const React = require('react');
const {Link, RouterView, getRouter} = require('@benson.liao/capybara-router');
const i18n = require('../../../i18n').default;
const Loading = require('../../../core/components/loading');
const Base = require('../shared/base');

module.exports = class System extends Base {
  constructor(props) {
    super(props);
    const router = getRouter();

    this.state.currentRouteName = router.currentRoute.name;
    this.$listens.push(
      router.listen('ChangeSuccess', (action, toState) => {
        this.setState({currentRouteName: toState.name});
      })
    );
    if (this.state.currentRouteName === 'web.system') {
      setTimeout(() => {
        router.go({name: 'web.system.datetime'});
      });
    }
  }

  render() {
    const {currentRouteName} = this.state;
    const topSubNav = ['web.system.datetime', 'web.system.maintain', 'web.system.upgrade'].some(route => route === currentRouteName);
    const bottomSubNav = ['web.system.log', 'web.system.information'].some(route => route === currentRouteName);
    return (
      <>
        <div className="left-menu fixed-top">
          <h2>{i18n.t('navigation.sidebar.system')}</h2>
          <nav className="nav flex-column">
            <div className="accordion" id="accordion-setting-menu">
              <a
                href="#"
                data-toggle="collapse"
                data-target="#basic-settings"
                title={i18n.t('navigation.sidebar.administration')}
                className={classNames(
                  'nav-link collapse d-flex justify-content-between align-items-center',
                  {
                    active: [
                      'web.system.datetime',
                      'web.system.maintain',
                      'web.system.upgrade'
                    ].indexOf(currentRouteName) >= 0
                  },
                  {show: topSubNav},
                  {collapsed: !topSubNav}
                )}
              >
                <span className="text-truncate">{i18n.t('navigation.sidebar.administration')}</span>
                <i className="fas fa-chevron-up"/>
              </a>
              <div id="basic-settings" className={classNames('collapse', {show: topSubNav})} data-parent="#accordion-setting-menu">
                <Link
                  className={classNames('nav-link', {active: currentRouteName === 'web.system.datetime'})}
                  to="/system/datetime"
                  title={i18n.t('navigation.sidebar.dateTime')}
                >
                  {i18n.t('navigation.sidebar.dateTime')}
                </Link>
                <Link
                  className={classNames('nav-link', {active: currentRouteName === 'web.system.maintain'})}
                  to="/system/maintain"
                  title={i18n.t('navigation.sidebar.deviceMaintenance')}
                >
                  {i18n.t('navigation.sidebar.deviceMaintenance')}
                </Link>
                <Link
                  className={classNames('nav-link', {active: currentRouteName === 'web.system.upgrade'})}
                  to="/system/upgrade"
                  title={i18n.t('navigation.sidebar.softwareUpgrade')}
                >
                  {i18n.t('navigation.sidebar.softwareUpgrade')}
                </Link>
              </div>
              <a
                href="#"
                data-toggle="collapse"
                data-target="#basic-information"
                title={i18n.t('navigation.sidebar.status')}
                className={classNames(
                  'nav-link collapse d-flex justify-content-between align-items-center',
                  {
                    active: [
                      'web.system.log',
                      'web.system.information'
                    ].indexOf(currentRouteName) >= 0
                  },
                  {show: bottomSubNav},
                  {collapsed: !bottomSubNav}
                )}
              >
                <span className="text-truncate">{i18n.t('navigation.sidebar.status')}</span>
                <i className="fas fa-chevron-up"/>
              </a>
              <div id="basic-information" className={classNames('collapse', {show: bottomSubNav})} data-parent="#accordion-setting-menu">
                <Link
                  className={classNames('nav-link', {active: currentRouteName === 'web.system.log'})}
                  to="/system/log"
                  title={i18n.t('navigation.sidebar.systemLog')}
                >
                  {i18n.t('navigation.sidebar.systemLog')}
                </Link>
                <Link
                  className={classNames('nav-link', {active: currentRouteName === 'web.system.information'})}
                  to="/system/information"
                  title={i18n.t('navigation.sidebar.status')}
                >
                  {i18n.t('navigation.sidebar.information')}
                </Link>
              </div>
            </div>
          </nav>
        </div>

        <RouterView><Loading/></RouterView>
      </>
    );
  }
};
