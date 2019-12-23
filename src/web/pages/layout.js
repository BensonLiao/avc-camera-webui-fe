const classNames = require('classnames');
const React = require('react');
const progress = require('nprogress');
const {RouterView} = require('capybara-router');
const ReactNotification = require('react-notifications-component').default;
const Base = require('./shared/base');
const {Link, getRouter} = require('capybara-router');
const Loading = require('../../core/components/loading');
const iconHome = require('webserver-prototype/src/resource/left-navigation-home.svg');
const iconMedia = require('webserver-prototype/src/resource/left-navigation-media.svg');
const iconNotification = require('webserver-prototype/src/resource/left-navigation-bell.svg');
const iconMembers = require('webserver-prototype/src/resource/left-navigation-users.svg');
const iconSmart = require('webserver-prototype/src/resource/left-navigation-smart.svg');
const iconHistories = require('webserver-prototype/src/resource/left-navigation-histories.svg');
const iconSystem = require('webserver-prototype/src/resource/left-navigation-system.svg');
const iconSecurity = require('webserver-prototype/src/resource/left-navigation-security.svg');
const iconLicense = require('webserver-prototype/src/resource/left-navigation-license.svg');
const iconDevelop = require('webserver-prototype/src/resource/left-navigation-develop.svg');
const logo = require('webserver-prototype/src/resource/logo-02.svg');
const Tooltip = require('../../core/components/tooltip');
const api = require('../../core/apis/web-api');
const utils = require('../../core/utils');
const _ = require('../../languages');

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

  generateChangeLanguageHandler = languageCode => event => {
    event.preventDefault();
    progress.start();
    api.system.updateLanguage(languageCode)
      .then(() => {
        location.reload();
      })
      .catch(error => {
        progress.done();
        utils.renderError(error);
      });
  };

  onClickLogout(event) {
    event.preventDefault();
    progress.start();
    api.account.logout()
      .then(() => {
        location.href = '/';
      })
      .catch(error => {
        progress.done();
        utils.renderError(error);
      });
  }

  render() {
    const classTable = {
      homeLink: classNames(
        'btn d-flex justify-content-center align-items-center',
        {active: this.state.currentRouteName === 'web.home'}
      ),
      mediaLink: classNames(
        'btn d-flex justify-content-center align-items-center'
      ),
      notification: classNames(
        'btn d-flex justify-content-center align-items-center'
      ),
      members: classNames(
        'btn d-flex justify-content-center align-items-center',
        {
          active: [
            'web.members',
            'web.members.new-group',
            'web.members.modify-group',
            'web.members.new-member',
            'web.members.details'
          ].indexOf(this.state.currentRouteName) >= 0
        }
      ),
      smart: classNames(
        'btn d-flex justify-content-center align-items-center'
      ),
      historis: classNames(
        'btn d-flex justify-content-center align-items-center',
        {
          active: ['web.events'].indexOf(this.state.currentRouteName) >= 0
        }
      ),
      system: classNames(
        'btn d-flex justify-content-center align-items-center'
      ),
      security: classNames(
        'btn d-flex justify-content-center align-items-center',
        {
          active: [
            'web.security',
            'web.security.users',
            'web.security.https',
            'web.security.off-line'
          ].indexOf(this.state.currentRouteName) >= 0
        }
      ),
      license: classNames(
        'btn d-flex justify-content-center align-items-center',
        {
          active: ['web.license'].indexOf(this.state.currentRouteName) >= 0
        }
      ),
      develop: classNames(
        'btn d-flex justify-content-center align-items-center'
      )
    };
    const tooltipOptions = {
      delay: {show: 1500, hide: 0},
      offset: '0,-4',
      boundary: 'viewport'
    };

    return (
      <>
        <div className="left-navigation fixed-top">
          <Tooltip title={_('Home')} {...tooltipOptions}>
            <Link className={classTable.homeLink} to="/">
              <img src={iconHome}/>
            </Link>
          </Tooltip>
          <Tooltip title={_('Multimedia settings')} {...tooltipOptions}>
            <Link className={classTable.mediaLink} to="/media/stream.html">
              <img src={iconMedia}/>
            </Link>
          </Tooltip>
          <Tooltip title={_('Notification settings')} {...tooltipOptions}>
            <Link className={classTable.notification} to="/notification/app.html">
              <img src={iconNotification}/>
            </Link>
          </Tooltip>
          <Tooltip title={_('Members')} {...tooltipOptions}>
            <Link className={classTable.members} to="/members">
              <img src={iconMembers}/>
            </Link>
          </Tooltip>
          <Tooltip title={_('Smart function')} {...tooltipOptions}>
            <Link className={classTable.smart} to="/smart/face-recognition.html">
              <img src={iconSmart}/>
            </Link>
          </Tooltip>
          <Tooltip title={_('Smart search')} {...tooltipOptions}>
            <Link className={classTable.historis} to="/events">
              <img src={iconHistories}/>
            </Link>
          </Tooltip>
          <Tooltip title={_('System')} {...tooltipOptions}>
            <Link className={classTable.system} to="/system/date.html">
              <img src={iconSystem}/>
            </Link>
          </Tooltip>
          <Tooltip title={_('Security')} {...tooltipOptions}>
            <Link className={classTable.security} to="/security/account">
              <img src={iconSecurity}/>
            </Link>
          </Tooltip>
          <Tooltip title={_('License')} {...tooltipOptions}>
            <Link className={classTable.license} to="/license">
              <img src={iconLicense}/>
            </Link>
          </Tooltip>
          <Tooltip title={_('Develop')} {...tooltipOptions}>
            <Link className={classTable.develop} to="/develop">
              <img src={iconDevelop}/>
            </Link>
          </Tooltip>
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
                    <i className="fas fa-globe fa-fw"/> {window.config.languages[window.currentLanguageCode].title}
                  </button>
                  <div className="dropdown-menu dropdown-menu-right">
                    {
                      Object.keys(window.config.languages).map(languageCode => (
                        <a key={languageCode} className="dropdown-item"
                          href={`#${languageCode}`}
                          onClick={this.generateChangeLanguageHandler(languageCode)}
                        >
                          {window.config.languages[languageCode].title}
                        </a>
                      ))
                    }
                  </div>
                </div>
              </div>

              <div className="col">
                <div className="dropdown">
                  <button className="btn text-primary dropdown-toggle" type="button" data-toggle="dropdown">
                    {this.state.$user.account}
                  </button>
                  <div className="dropdown-menu dropdown-menu-right">
                    <a className="dropdown-item" href="#logout" onClick={this.onClickLogout}>{_('Sign out')}</a>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </nav>

        <ReactNotification/>
        <RouterView>
          <Loading/>
        </RouterView>
      </>
    );
  }
};
