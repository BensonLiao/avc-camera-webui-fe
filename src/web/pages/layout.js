const classNames = require('classnames');
const React = require('react');
const progress = require('nprogress');
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
const logo = require('webserver-prototype/src/resource/logo-02.svg');
const api = require('../../core/apis/web-api');

module.exports = class Layout extends Base {
  constructor(props) {
    super(props);
    const router = getRouter();

    this.onClickLogout = this.onClickLogout.bind(this);

    this.state.currentRouteName = router.currentRoute.name;
    this.$listens.push(
      router.listen('ChangeStart', (action, toState) => {
        this.setState({
          currentRouteName: toState.name
        });
      })
    );
  }

  onClickLogout(event) {
    event.preventDefault();
    progress.start();
    api.account.logout()
      .then(() => {
        location.href = '/';
      })
      .catch(error => {
        progress.done();
        getRouter().renderError(error);
      });
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

        <nav className="navbar navbar-expand fixed-top shadow-sm">
          <Link className="navbar-brand" to="/">
            <img src={logo} height="24" className="logo"/>
          </Link>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navigation">
            <span className="navbar-toggler-icon"/>
          </button>
          <div className="collapse navbar-collapse" id="navigation">
            <ul className="navbar-nav mr-auto"/>
            <form className="form-row text-right">
              <div className="col d-none d-sm-block">
                <div className="dropdown">
                  <button className="btn dropdown-toggle" type="button" data-toggle="dropdown">
                    <i className="fas fa-globe fa-fw"/> 中文(繁體)
                  </button>
                  <div className="dropdown-menu dropdown-menu-right">
                    <a className="dropdown-item" href="#">中文(繁體)</a>
                    <a className="dropdown-item" href="#">English</a>
                  </div>
                </div>
              </div>

              <div className="col">
                <div className="dropdown">
                  <button className="btn text-primary dropdown-toggle" type="button" data-toggle="dropdown">
                    {this.state.$user.account}
                  </button>
                  <div className="dropdown-menu dropdown-menu-right">
                    <a className="dropdown-item" href="#logout" onClick={this.onClickLogout}>Sign out</a>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </nav>

        <RouterView>
          <Loading/>
        </RouterView>
      </>
    );
  }
};
