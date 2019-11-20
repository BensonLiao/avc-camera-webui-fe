const classNames = require('classnames');
const React = require('react');
const {RouterView, Link, getRouter} = require('capybara-router');
const Base = require('../shared/base');
const _ = require('../../../languages');

module.exports = class Security extends Base {
  constructor(props) {
    super(props);
    const router = getRouter();
    console.log('security.router', router);
  }

  render() {
    return (
      <>
        {/* Left menu */}
        <div className="left-menu fixed-top">
          <h2>{_('Security')}</h2>
          <nav className="nav flex-column">
            <Link to="/security/account" title={_('All members')}
              className={classNames('nav-link', {active: true})}
            >
              帳號設定
            </Link>
          </nav>
        </div>

        {/* Main content */}
        <RouterView/>
      </>
    );
  }
};
