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
        router.go({name: 'web.system.upgrade'});
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
            <div className="accordion" id="accordion-notification-menu">
              <a href="#" data-toggle="collapse" data-target="#basic-settings"
                title={_('System settings')}
                className={classNames(
                  'nav-link collapse show d-flex justify-content-between align-items-center',
                  {active: ['web.system.upgrade'].indexOf(currentRouteName) >= 0}
                )}
              >
                <span className="text-truncate">{_('System settings')}</span>
                <i className="fas fa-chevron-up"/>
              </a>
              <div id="basic-settings" className="collapse show" data-parent="#accordion-notification-menu">
                <Link className={classNames('nav-link', {active: currentRouteName === 'web.system.upgrade'})} to="/system/upgrade" title={_('Firmware upgrade')}>
                  {_('Firmware upgrade')}
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
