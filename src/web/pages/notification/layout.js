const classNames = require('classnames');
const React = require('react');
const {Link, RouterView, getRouter} = require('capybara-router');
const Loading = require('../../../core/components/loading');
const Base = require('../shared/base');
const _ = require('../../../languages');

module.exports = class Notification extends Base {
  constructor(props) {
    super(props);
    const router = getRouter();

    this.state.currentRouteName = router.currentRoute.name;
    this.$listens.push(
      router.listen('ChangeStart', (action, toState) => {
        this.setState({currentRouteName: toState.name});
      })
    );
    if (this.state.currentRouteName === 'web.notification') {
      setTimeout(() => {
        router.go({name: 'web.notification.smtp'});
      });
    }
  }

  render() {
    const {currentRouteName} = this.state;

    return (
      <>
        {/* Left menu */}
        <div className="left-menu fixed-top">
          <h2>{_('Notification settings')}</h2>
          <nav className="nav flex-column">
            <div className="accordion" id="accordion-notification-menu">
              <a href="#" data-toggle="collapse" data-target="#basic-settings"
                title={_('Basic settings')}
                className={classNames(
                  'nav-link collapse show d-flex justify-content-between align-items-center',
                  {active: ['web.notification.smtp', 'web.notification.io'].indexOf(currentRouteName) >= 0}
                )}
              >
                <span className="text-truncate">{_('Basic settings')}</span>
                <i className="fas fa-chevron-up"/>
              </a>
              <div id="basic-settings" className="collapse show" data-parent="#accordion-notification-menu">
                <Link className={classNames('nav-link', {active: currentRouteName === 'web.notification.smtp'})} to="/notification/smtp" title={_('Mail')}>
                  {_('Mail')}
                </Link>
                <Link className={classNames('nav-link', {active: currentRouteName === 'web.notification.io'})} to="/notification/io" title={_('I/O')}>
                  {_('I/O')}
                </Link>
              </div>
            </div>
            <Link className={classNames('nav-link', {active: currentRouteName === 'web.notification.cards'})} to="/notification/cards" title={_('Smart notifications')}>
              {_('Smart notifications')}
            </Link>
          </nav>
        </div>

        {/* Main content */}
        <RouterView><Loading/></RouterView>
      </>
    );
  }
};
