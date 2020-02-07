const PropTypes = require('prop-types');
const classNames = require('classnames');
const React = require('react');
const progress = require('nprogress');
const {RouterView} = require('capybara-router');
const Base = require('./shared/base');
const {Link, getRouter} = require('capybara-router');
const Modal = require('react-bootstrap/Modal').default;
const Loading = require('../../core/components/loading');
const iconHome = require('../../resource/left-navigation-home.svg');
const iconMedia = require('../../resource/left-navigation-media.svg');
const iconNotification = require('../../resource/left-navigation-bell.svg');
const iconMembers = require('../../resource/left-navigation-users.svg');
const iconSmart = require('../../resource/left-navigation-smart.svg');
const iconHistories = require('../../resource/left-navigation-histories.svg');
const iconSystem = require('../../resource/left-navigation-system.svg');
const iconSecurity = require('../../resource/left-navigation-security.svg');
const iconLicense = require('../../resource/left-navigation-license.svg');
const iconDevelop = require('../../resource/left-navigation-develop.svg');
const logo = require('../../resource/logo-avn.svg');
const Tooltip = require('../../core/components/tooltip');
const api = require('../../core/apis/web-api');
const utils = require('../../core/utils');
const _ = require('../../languages');

module.exports = class Layout extends Base {
  static get propTypes() {
    return {
      systemInformation: PropTypes.shape({
        languageCode: PropTypes.oneOf(['en-us', 'zh-tw', 'zh-cn', 'ja-jp', 'es-es']).isRequired,
        deviceName: PropTypes.string.isRequired,
        isEnableFaceRecognition: PropTypes.bool.isRequired,
        isEnableAgeGender: PropTypes.bool.isRequired,
        isEnableHumanoidDetection: PropTypes.bool.isRequired,
        deviceStatus: PropTypes.oneOf([0, 1]).isRequired,
        usedDiskSize: PropTypes.number.isRequired,
        totalDiskSize: PropTypes.number.isRequired,
        serialNumber: PropTypes.string.isRequired,
        modelName: PropTypes.string.isRequired,
        firmware: PropTypes.string.isRequired
      }).isRequired,
      networkSettings: PropTypes.shape({
        mac: PropTypes.string.isRequired
      }).isRequired
    };
  }

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
    this.state.isShowAboutModal = false;
  }

  showAboutModal = () => {
    this.setState({isShowAboutModal: true});
  };

  hideAboutModal = () => {
    this.setState({isShowAboutModal: false});
  };

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

  onClickLogout = event => {
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
    const {systemInformation, networkSettings} = this.props;
    const classTable = {
      homeLink: classNames(
        'btn d-flex justify-content-center align-items-center',
        {active: this.state.currentRouteName === 'web.home'}
      ),
      mediaLink: classNames(
        'btn d-flex justify-content-center align-items-center',
        {
          active: [
            'web.media',
            'web.media.stream',
            'web.media.rtsp',
            'web.media.word',
            'web.media.privacy-mask',
            'web.media.audio'
          ].indexOf(this.state.currentRouteName) >= 0
        }
      ),
      notification: classNames(
        'btn d-flex justify-content-center align-items-center',
        {
          active: [
            'web.notification',
            'web.notification.app',
            'web.notification.io',
            'web.notification.smtp',
            'web.notification.cards'
          ].indexOf(this.state.currentRouteName) >= 0
        }
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
        'btn d-flex justify-content-center align-items-center',
        {
          active: [
            'web.smart',
            'web.smart.face-recognition'
          ].indexOf(this.state.currentRouteName) >= 0
        }
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
            'web.security.users.details',
            'web.security.users.new-user',
            'web.security.https'
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
            <Link className={classTable.mediaLink} to="/media/stream">
              <img src={iconMedia}/>
            </Link>
          </Tooltip>
          <Tooltip title={_('Notification settings')} {...tooltipOptions}>
            <Link className={classTable.notification} to="/notification/app">
              <img src={iconNotification}/>
            </Link>
          </Tooltip>
          <Tooltip title={_('Members')} {...tooltipOptions}>
            <Link className={classTable.members} to="/members">
              <img src={iconMembers}/>
            </Link>
          </Tooltip>
          <Tooltip title={_('Smart functions')} {...tooltipOptions}>
            <Link className={classTable.smart} to="/smart/face-recognition">
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
          <Link className="navbar-brand py-0 mx-0" to="/">
            <img src={logo} className="logo"/>
          </Link>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navigation">
            <span className="navbar-toggler-icon"/>
          </button>
          <div className="collapse navbar-collapse" id="navigation">
            <ul className="navbar-nav mr-auto"/>
            <form className="form-row text-right">
              <div className="col d-none d-sm-block">
                <button className="btn text-primary border-primary" type="button" onClick={this.showAboutModal}>
                  <i className="fas fa-info-circle text-primary text-size-20 mr-0" style={{width: '20px'}}/>
                </button>
              </div>

              <div className="col">
                <div className="dropdown">
                  <button className="btn text-primary border-primary dropdown-toggle" type="button" data-toggle="dropdown">
                    <i className="fas fa-question-circle text-primary text-size-20" style={{width: '20px', marginRight: '4px'}}/>
                  </button>
                  <div className="dropdown-menu dropdown-menu-right">
                    <h5 className="dropdown-header text-primary">Support</h5>
                    <a className="dropdown-item" href="https://www.arecontvision.com/resource" target="_blank" rel="noopener noreferrer">
                      {_('Resources')}
                    </a>
                    <a className="dropdown-item" href="https://arecontvision.zendesk.com/hc/en-us" target="_blank" rel="noopener noreferrer">
                      {_('Online Support Request')}
                    </a>
                    <a className="dropdown-item" href="https://sales.arecontvision.com/firmware.php" target="_blank" rel="noopener noreferrer">
                      {_('Firmware Downloads')}
                    </a>
                    <a className="dropdown-item" href="https://sales.arecontvision.com/software.php" target="_blank" rel="noopener noreferrer">
                      {_('Software Downloads')}
                    </a>
                    <a className="dropdown-item" href="https://sales.arecontvision.com/bulletins/Technical" target="_blank" rel="noopener noreferrer">
                      {_('Technical Updates')}
                    </a>
                    <a className="dropdown-item" href="https://sales.arecontvision.com/productselector.php" target="_blank" rel="noopener noreferrer">
                      {_('Product Selector')}
                    </a>
                    <a className="dropdown-item" href="https://sales.arecontvision.com/downloads.php" target="_blank" rel="noopener noreferrer">
                      {_('Downloads')}
                    </a>
                  </div>
                </div>
              </div>

              <div className="col">
                <div className="dropdown">
                  <button className="btn bg-primary border-primary text-white dropdown-toggle" type="button" data-toggle="dropdown">
                    <i className="fas fa-user text-white"/>
                  </button>
                  <div className="dropdown-menu dropdown-menu-right">
                    <h5 className="dropdown-header text-primary">
                      {_(`permission-${this.state.$user.permission}`)}
                    </h5>
                    <span className="dropdown-item-text font-weight-bold">{this.state.$user.account}</span>
                    <div className="dropdown-divider"/>
                    <a className="dropdown-item" href="#logout" onClick={this.onClickLogout}>
                      {_('Sign out')}
                    </a>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </nav>

        {/* About info modal */}
        <Modal
          show={this.state.isShowAboutModal}
          autoFocus={false}
          onHide={this.hideAboutModal}
        >
          <div className="modal-header">
            <h5 className="modal-title">{_('About')}</h5>
          </div>
          <div className="modal-body">
            <div className="text-info">{_('Model name :')}</div>
            <div className="text-primary font-weight-bold">{systemInformation.modelName}</div>
            <div className="text-info">{_('Firmware :')}</div>
            <div className="text-primary font-weight-bold">{systemInformation.firmware}</div>
            <div className="text-info">{_('Serial number :')}</div>
            <div className="text-primary font-weight-bold">{systemInformation.serialNumber}</div>
            <div className="text-info">{_('MAC address :')}</div>
            <div className="text-primary font-weight-bold">{networkSettings.mac}</div>
          </div>
          <div className="modal-footer flex-column">
            <button
              type="button"
              className="btn btn-secondary btn-block m-0 rounded-pill bg-info text-white"
              onClick={this.hideAboutModal}
            >
              {_('Close')}
            </button>
          </div>
        </Modal>

        <RouterView>
          <Loading/>
        </RouterView>
      </>
    );
  }
};
