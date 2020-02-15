const classNames = require('classnames');
const React = require('react');
const {RouterView, Link, getRouter} = require('capybara-router');
const Base = require('../shared/base');
const _ = require('../../../languages');
const Loading = require('../../../core/components/loading');

module.exports = class Users extends Base {
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
    if (this.state.currentRouteName === 'web.users') {
      setTimeout(() => {
        router.go({
          name: 'web.users.members',
          params: this.props.params
        });
      });
    }
  }

  render() {
    return (
      <>
        {/* Left menu */}
        <nav className="navbar fixed-top sub shadow-none w-100">
          <div className="nav nav-tabs w-100">
            <Link
              to="/users/members"
              title={_('Members')}
              data-toggle="tab"
              className={classNames('nav-item nav-link', {
                active: this.state.currentRouteName === 'web.users.members'
              })}
            >
              {_('Members')}
            </Link>
            <Link
              to="/users/accounts"
              title={_('Accounts')}
              data-toggle="tab"
              className={classNames('nav-item nav-link', {
                active: this.state.currentRouteName === 'web.users.accounts'
              })}
            >
              {_('Accounts')}
            </Link>
            <Link
              to="/users/events"
              title={_('Events')}
              data-toggle="tab"
              className={classNames('nav-item nav-link', {
                active: this.state.currentRouteName === 'web.users.events'
              })}
            >
              {_('Events')}
            </Link>
          </div>
        </nav>

        {/* Main content */}
        <RouterView><Loading/></RouterView>
      </>
    );
  }
};
