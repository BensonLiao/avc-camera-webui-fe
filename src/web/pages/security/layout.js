const classNames = require('classnames');
const React = require('react');
const {RouterView, Link, getRouter} = require('capybara-router');
const Base = require('../shared/base');
const _ = require('../../../languages');
const Loading = require('../../../core/components/loading');

module.exports = class Security extends Base {
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
    if (this.state.currentRouteName === 'web.security') {
      setTimeout(() => {
        router.go({name: 'web.users.account'});
      });
    }
  }

  render() {
    return (
      <>
        {/* Left menu */}
        <div className="left-menu fixed-top">
          <h2>{_('Security')}</h2>
          <nav className="nav flex-column">
            <Link to="/security/account" title={_('Account settings')}
              className={classNames(
                'nav-link',
                {active: ['web.users.account', 'web.users.account.details', 'web.users.account.new-user'].indexOf(this.state.currentRouteName) >= 0}
              )}
            >
              {_('Account settings')}
            </Link>
            <Link to="/security/https" title="HTTPS"
              className={classNames('nav-link', {active: this.state.currentRouteName === 'web.security.https'})}
            >
              HTTPS
            </Link>
          </nav>
        </div>

        {/* Main content */}
        <RouterView><Loading/></RouterView>
      </>
    );
  }
};
