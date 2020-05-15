const classNames = require('classnames');
const React = require('react');
const {Link, RouterView, getRouter} = require('capybara-router');
const _ = require('../../../languages');
const Loading = require('../../../core/components/loading');
const Base = require('../shared/base');

module.exports = class System extends Base {
  constructor(props) {
    super(props);
    const router = getRouter();

    this.state.currentRouteName = router.currentRoute.name;
    this.$listens.push(
      router.listen('ChangeStart', (action, toState) => {
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

    return (
      <>
        <div className="left-menu fixed-top">
          <h2>{_('System')}</h2>
          <nav className="nav flex-column">
            <div className="accordion" id="accordion-setting-menu">
              <a href="#" data-toggle="collapse" data-target="#basic-settings"
                title={_('Settings')}
                className={classNames(
                  'nav-link collapse show d-flex justify-content-between align-items-center',
                  {active: [
                    'web.system.datetime',
                    'web.system.maintain',
                    'web.system.upgrade'
                  ].indexOf(currentRouteName) >= 0}
                )}
              >
                <span className="text-truncate">{_('Settings')}</span>
                <i className="fas fa-chevron-up"/>
              </a>
              <div id="basic-settings" className="collapse show" data-parent="#accordion-setting-menu">
                <Link className={classNames('nav-link', {active: currentRouteName === 'web.system.datetime'})} to="/system/datetime" title={_('Date & Region')}>
                  {_('Date & Region')}
                </Link>
                <Link className={classNames('nav-link', {active: currentRouteName === 'web.system.maintain'})} to="/system/maintain" title={_('Device Maintain')}>
                  {_('Device Maintenace')}
                </Link>
                <Link className={classNames('nav-link', {active: currentRouteName === 'web.system.upgrade'})} to="/system/upgrade" title={_('Firmware Upgrade')}>
                  {_('Firmware Upgrade')}
                </Link>
              </div>
              <a href="#" data-toggle="collapse" data-target="#basic-information"
                title={_('System Information')}
                className={classNames(
                  'nav-link collapse d-flex justify-content-between align-items-center collapsed',
                  {active: [
                    'web.system.log',
                    'web.system.information'
                  ].indexOf(currentRouteName) >= 0}
                )}
              >
                <span className="text-truncate">{_('System Information')}</span>
                <i className="fas fa-chevron-up"/>
              </a>
              <div id="basic-information" className="collapse" data-parent="#accordion-setting-menu">
                <Link className={classNames('nav-link', {active: currentRouteName === 'web.system.log'})} to="/system/log" title={_('System Log')}>
                  {_('System Log')}
                </Link>
                <Link className={classNames('nav-link', {active: currentRouteName === 'web.system.information'})} to="/system/information" title={_('System information')}>
                  {_('Information')}
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
