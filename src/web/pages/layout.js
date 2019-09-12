const classNames = require('classnames');
const React = require('react');
const {RouterView} = require('capybara-router');
const Base = require('./shared/base');
const {Link, getRouter} = require('capybara-router');
const Loading = require('../../core/components/loading');
const iconHome = require('webserver-prototype/src/resource/left-navigation-home.svg');
const iconMedia = require('webserver-prototype/src/resource/left-navigation-media.svg');
const iconNotification = require('webserver-prototype/src/resource/left-navigation-bell.svg');
const iconUsers = require('webserver-prototype/src/resource/left-navigation-users.svg');
const iconSmart = require('webserver-prototype/src/resource/left-navigation-smart.svg');
const iconHistories = require('webserver-prototype/src/resource/left-navigation-histories.svg');
const iconSystem = require('webserver-prototype/src/resource/left-navigation-system.svg');
const iconSecurity = require('webserver-prototype/src/resource/left-navigation-security.svg');
const iconLicense = require('webserver-prototype/src/resource/left-navigation-license.svg');
const iconDevelop = require('webserver-prototype/src/resource/left-navigation-develop.svg');

module.exports = class Layout extends Base {
  constructor(props) {
    super(props);

    this.state.currentRouteName = '';
    this.$subscriptions.push(
      getRouter().listen('ChangeSuccess', (action, toState) => {
        this.setState({
          currentRouteName: toState.name
        });
      })
    );
  }

  render() {
    const classTable = {
      homeLink: classNames([
        'btn d-flex justify-content-center align-items-center',
        {active: this.state.currentRouteName === 'web.home'}
      ]),
      mediaLink: classNames([
        'btn d-flex justify-content-center align-items-center'
      ]),
      notification: classNames([
        'btn d-flex justify-content-center align-items-center'
      ]),
      users: classNames([
        'btn d-flex justify-content-center align-items-center'
      ]),
      smart: classNames([
        'btn d-flex justify-content-center align-items-center'
      ]),
      historis: classNames([
        'btn d-flex justify-content-center align-items-center'
      ]),
      system: classNames([
        'btn d-flex justify-content-center align-items-center'
      ]),
      security: classNames([
        'btn d-flex justify-content-center align-items-center'
      ]),
      license: classNames([
        'btn d-flex justify-content-center align-items-center'
      ]),
      develop: classNames([
        'btn d-flex justify-content-center align-items-center'
      ])
    };

    return (
      <>
        <div className="left-navigation fixed-top">
          <Link className={classTable.homeLink} to="/">
            <img src={iconHome}/>
          </Link>
          <Link className={classTable.mediaLink} to="/media/stream.html">
            <img src={iconMedia}/>
          </Link>
          <Link className={classTable.notification} to="/notification/app.html">
            <img src={iconNotification}/>
          </Link>
          <Link className={classTable.users} to="/user/users.html">
            <img src={iconUsers}/>
          </Link>
          <Link className={classTable.smart} to="/smart/face-recognition.html">
            <img src={iconSmart}/>
          </Link>
          <Link className={classTable.historis} to="/history/face-recognition.html">
            <img src={iconHistories}/>
          </Link>
          <Link className={classTable.system} to="/system/date.html">
            <img src={iconSystem}/>
          </Link>
          <Link className={classTable.security} to="/security/account.html">
            <img src={iconSecurity}/>
          </Link>
          <Link className={classTable.license} to="/license">
            <img src={iconLicense}/>
          </Link>
          <Link className={classTable.develop} to="/develop">
            <img src={iconDevelop}/>
          </Link>
        </div>

        <RouterView>
          <Loading/>
        </RouterView>
      </>
    );
  }
};
