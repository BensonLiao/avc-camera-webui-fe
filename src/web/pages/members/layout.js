const classNames = require('classnames');
const React = require('react');
const {RouterView, Link, getRouter} = require('@benson.liao/capybara-router');
const Base = require('../shared/base');
const i18n = require('../../../i18n').default;
const Loading = require('../../../core/components/loading');

module.exports = class Users extends Base {
  constructor(props) {
    super(props);
    const router = getRouter();

    this.state.currentRouteName = router.currentRoute.name;
    this.$listens.push(
      router.listen('ChangeSuccess', (action, toState) => {
        this.setState({currentRouteName: toState.name});
      })
    );
    if (this.state.currentRouteName === 'web.users') {
      setTimeout(() => {
        router.go({
          name: 'web.users.members',
          params: props.params
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
              title={i18n.t('navigation.sidebar.members')}
              data-toggle="tab"
              className={classNames('nav-item nav-link mr-4', {active: this.state.currentRouteName.indexOf('web.users.members') === 0})}
            >
              <span>
                {i18n.t('navigation.sidebar.members')}
              </span>
            </Link>
            <Link
              to="/users/accounts"
              title={i18n.t('navigation.sidebar.accounts')}
              data-toggle="tab"
              className={classNames('nav-item nav-link mx-4', {active: this.state.currentRouteName.indexOf('web.users.accounts') === 0})}
            >
              {i18n.t('navigation.sidebar.accounts')}
            </Link>
            <Link
              to="/users/events"
              title={i18n.t('navigation.sidebar.events')}
              data-toggle="tab"
              className={classNames('nav-item nav-link mx-4', {active: this.state.currentRouteName === 'web.users.events'})}
            >
              {i18n.t('navigation.sidebar.events')}
            </Link>
          </div>
        </nav>

        {/* Main content */}
        <RouterView><Loading/></RouterView>
      </>
    );
  }
};
