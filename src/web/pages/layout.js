const PropTypes = require('prop-types');
const classNames = require('classnames');
const download = require('downloadjs');
const React = require('react');
const progress = require('nprogress');
const {RouterView} = require('@benson.liao/capybara-router');
const Base = require('./shared/base');
const {Link, getRouter} = require('@benson.liao/capybara-router');
const Modal = require('react-bootstrap/Modal').default;
const UserPermission = require('webserver-form-schema/constants/user-permission');
const Loading = require('../../core/components/loading');
const iconHome = require('../../resource/left-navigation-home.svg');
const iconMedia = require('../../resource/left-navigation-media.svg');
const iconAudio = require('../../resource/left-navigation-audio.svg');
const iconNotification = require('../../resource/left-navigation-bell.svg');
const iconUserManagement = require('../../resource/left-navigation-users.svg');
const iconAnalytic = require('../../resource/left-navigation-analytic.svg');
const iconNetwork = require('../../resource/left-navigation-network.svg');
const iconSystem = require('../../resource/left-navigation-system.svg');
const iconSDCard = require('../../resource/left-navigation-sd-card.svg');
const logo = require('../../resource/logo-avc.svg');
const ErrorDisplay = require('../../core/components/error-display');
const CustomTooltip = require('../../core/components/tooltip');
const SessionExpireModal = require('../../core/components/session-expire-modal');
const api = require('../../core/apis/web-api');
const i18n = require('../../i18n').default;
const constants = require('../../core/constants');
const store = require('../../core/store');
const utils = require('../../core/utils');
const wrappedApi = require('../../core/apis');

module.exports = class Layout extends Base {
  static get propTypes() {
    return {
      systemInformation: PropTypes.shape({
        languageCode: PropTypes.oneOf(i18n.options.supportedLangCodes).isRequired,
        deviceName: PropTypes.string.isRequired,
        deviceStatus: PropTypes.oneOf([0, 1]).isRequired,
        serialNumber: PropTypes.string.isRequired,
        modelName: PropTypes.string.isRequired,
        firmware: PropTypes.string.isRequired
      }).isRequired,
      networkSettings: PropTypes.shape({mac: PropTypes.string.isRequired}).isRequired
    };
  }

  constructor(props) {
    super(props);
    const router = getRouter();
    this.state.currentRouteName = router.currentRoute.name;
    this.$listens.push(
      router.listen('ChangeSuccess', (action, toState) => {
        this.setState({currentRouteName: toState.name});
      })
    );
    this.state.isShowAboutModal = false;
    this.modelNameRef = React.createRef();
    this.countdownTimerID = null;
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
      .catch(progress.done);
  };

  onClickLogout = event => {
    event.preventDefault();
    store.set(constants.store.IS_NOT_CALL_UNLOAD_ALERT, true);
    progress.start();
    api.account.logout()
      .then(() => {
        location.href = '/';
      })
      .finally(progress.done);
  }

  // Override default onClick in Capybara-Router, in order to add $isApiProcessing to prevent navigation.
  onClickLink = event => {
    const {$isApiProcessing, $updateFocalLengthField} = this.state;
    event.preventDefault();
    if (event.metaKey || $isApiProcessing || $updateFocalLengthField) {
      return;
    }

    getRouter().go(event.target.src ? event.target.parentNode.pathname : event.target.pathname);
  }

  onAboutModalHover = text => _ => {
    this.countdownTimerID = setTimeout(() => {
      utils.generate3DText(text, this.modelNameRef.current);
    }, 3 * 1000);
  }

  onAboutModalHoverOut = () => {
    clearTimeout(this.countdownTimerID);
  }

  downloadManual = e => {
    e.preventDefault();
    wrappedApi({
      method: 'get',
      url: '/api/support/user-manual',
      responseType: 'blob'
    })
      .then(response => {
        download(response.data, 'manual.pdf');
      });
  }

  render() {
    const {systemInformation, networkSettings} = this.props;
    const {$user, currentRouteName, isShowAboutModal} = this.state;
    const isAdmin = $user.permission === UserPermission.root || $user.permission === UserPermission.superAdmin;
    const classTable = {
      home: classNames(
        'btn d-flex justify-content-center align-items-center',
        {active: currentRouteName === 'web.home'}
      ),
      media: classNames(
        'btn',
        {
          active: [
            'web.media',
            'web.media.stream',
            'web.media.rtsp',
            'web.media.hdmi',
            'web.media.osd',
            'web.media.privacy-mask'
          ].indexOf(currentRouteName) >= 0,
          'd-flex justify-content-center align-items-center': isAdmin,
          'd-none': !isAdmin
        }
      ),
      audio: classNames(
        'btn',
        {
          active: currentRouteName === 'web.audio',
          'd-flex justify-content-center align-items-center': isAdmin,
          'd-none': !isAdmin
        }
      ),
      notification: classNames(
        'btn',
        {
          active: [
            'web.notification',
            'web.notification.io',
            'web.notification.smtp',
            'web.notification.cards'
          ].indexOf(currentRouteName) >= 0,
          'd-flex justify-content-center align-items-center': isAdmin,
          'd-none': !isAdmin
        }
      ),
      users: classNames(
        'btn',
        {
          active: [
            'web.users.members',
            'web.users.members.new-group',
            'web.users.members.modify-group',
            'web.users.members.new-member',
            'web.users.members.details',
            'web.users.accounts',
            'web.users.accounts.details',
            'web.users.accounts.new-user',
            'web.users.events'
          ].indexOf(currentRouteName) >= 0,
          'd-flex justify-content-center align-items-center': isAdmin,
          'd-none': !isAdmin
        }
      ),
      smart: classNames(
        'btn',
        {
          active: [
            'web.smart',
            'web.smart.face-recognition',
            'web.smart.motion-detection',
            'web.smart.license'
          ].indexOf(currentRouteName) >= 0,
          'd-flex justify-content-center align-items-center': isAdmin,
          'd-none': !isAdmin
        }
      ),
      network: classNames(
        'btn',
        {
          active: currentRouteName.indexOf('web.network') === 0,
          'd-flex justify-content-center align-items-center': isAdmin,
          'd-none': !isAdmin
        }
      ),
      system: classNames(
        'btn',
        {
          active: currentRouteName.indexOf('web.system') === 0,
          'd-flex justify-content-center align-items-center': isAdmin,
          'd-none': !isAdmin
        }
      ),
      sdCard: classNames(
        'btn',
        {
          active: currentRouteName === 'web.sd-card',
          'd-flex justify-content-center align-items-center': isAdmin,
          'd-none': !isAdmin
        }
      )
    };

    return (
      <>
        { isAdmin && (
          <div className="left-navigation fixed-top">
            <CustomTooltip title={i18n.t('navigation.sidebar.tooltip.home')}>
              <Link className={classTable.home} to="/" onClick={this.onClickLink}>
                <img src={iconHome}/>
              </Link>
            </CustomTooltip>
            <CustomTooltip title={i18n.t('navigation.sidebar.tooltip.video')}>
              <Link className={classTable.media} to="/media/stream" onClick={this.onClickLink}>
                <img src={iconMedia}/>
              </Link>
            </CustomTooltip>
            <CustomTooltip title={i18n.t('navigation.sidebar.tooltip.audio')}>
              <Link className={classTable.audio} to="/audio" onClick={this.onClickLink}>
                <img src={iconAudio}/>
              </Link>
            </CustomTooltip>
            <CustomTooltip title={i18n.t('navigation.sidebar.tooltip.notification')}>
              <Link className={classTable.notification} to="/notification/smtp" onClick={this.onClickLink}>
                <img src={iconNotification}/>
              </Link>
            </CustomTooltip>
            <CustomTooltip title={i18n.t('navigation.sidebar.tooltip.userManagement')}>
              <Link className={classTable.users} to="/users/members" onClick={this.onClickLink}>
                <img src={iconUserManagement}/>
              </Link>
            </CustomTooltip>
            <CustomTooltip title={i18n.t('navigation.sidebar.tooltip.analytics')}>
              <Link className={classTable.smart} to="/analytic/face-recognition" onClick={this.onClickLink}>
                <img src={iconAnalytic}/>
              </Link>
            </CustomTooltip>
            <CustomTooltip title={i18n.t('navigation.sidebar.tooltip.network')}>
              <Link className={classTable.network} to="/network/settings" onClick={this.onClickLink}>
                <img src={iconNetwork}/>
              </Link>
            </CustomTooltip>
            <CustomTooltip title={i18n.t('navigation.sidebar.tooltip.system')}>
              <Link className={classTable.system} to="/system/datetime" onClick={this.onClickLink}>
                <img src={iconSystem}/>
              </Link>
            </CustomTooltip>
            <CustomTooltip title={i18n.t('navigation.sidebar.tooltip.sdCard')}>
              <Link className={classTable.sdCard} to="/sd-card" onClick={this.onClickLink}>
                <img src={iconSDCard}/>
              </Link>
            </CustomTooltip>
          </div>
        )}

        <nav className="navbar navbar-expand fixed-top">
          <Link className="navbar-brand py-0 mx-0" to="/">
            {!window.isNoBrand && <img src={logo} className="logo"/>}
          </Link>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navigation">
            <span className="navbar-toggler-icon"/>
          </button>
          <div className="collapse navbar-collapse" id="navigation">
            <ul className="navbar-nav mr-auto"/>
            <form className="form-row text-right">

              <div className="col">
                <div className="dropdown">
                  <button className="btn border-primary dropdown-toggle" type="button" data-toggle="dropdown">
                    <i className="fas fa-globe fa-fw"/>
                    {i18n.options.langCodesTitle[window.currentLanguageCode].title}
                  </button>
                  <div className="dropdown-menu dropdown-menu-right">
                    {
                      Object.keys(i18n.options.langCodesTitle).map(code => (
                        <a
                          key={code}
                          className="dropdown-item"
                          href={`#${code}`}
                          onClick={this.generateChangeLanguageHandler(code)}
                        >
                          {i18n.options.langCodesTitle[code].title}
                        </a>
                      ))
                    }
                  </div>
                </div>
              </div>

              <div className="col d-none d-sm-block">
                <button className="btn text-primary border-primary" type="button" onClick={this.showAboutModal}>
                  <i className="fas fa-info-circle text-primary text-size-20 mr-0" style={{width: '20px'}}/>
                </button>
              </div>

              <div className="col">
                <div className="dropdown">
                  <button className="btn border-primary dropdown-toggle" type="button" data-toggle="dropdown">
                    <i className="fas fa-question-circle text-size-20 mr-0 fa-fw"/>
                  </button>
                  <div className="dropdown-menu dropdown-menu-right">
                    <h6 className="dropdown-header">{i18n.t('navigation.appbar.support.support')}</h6>
                    {window.isNoBrand ? (
                      <a className="dropdown-item" href="" onClick={this.downloadManual}>
                        {i18n.t('navigation.appbar.support.deviceHelp')}
                      </a>
                    ) : (
                      <>
                        <a className="dropdown-item" href="http://androvideo.com/download.aspx" target="_blank" rel="noopener noreferrer">
                          {i18n.t('navigation.appbar.support.deviceHelp')}
                        </a>
                        <a className="dropdown-item" href="mailto:support@androvideo.com">
                          {i18n.t('navigation.appbar.support.technicalSupport')}
                        </a>
                        <a className="dropdown-item" href="http://androvideo.com/products.aspx" target="_blank" rel="noopener noreferrer">
                          {i18n.t('navigation.appbar.support.productInformation')}
                        </a>
                      </>
                    )}
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
                      {(() => {
                        switch ($user.permission) {
                          default: return <ErrorDisplay/>;
                          case UserPermission.root:
                          case UserPermission.superAdmin:
                            return i18n.t('navigation.appbar.constants.permission-0');
                          case UserPermission.guest:
                            return i18n.t('navigation.appbar.constants.permission-1');
                          case UserPermission.viewer:
                            return i18n.t('navigation.appbar.constants.permission-2');
                        }
                      })()}
                    </h5>
                    <span className="dropdown-item-text font-weight-bold">{$user.account}</span>
                    <div className="dropdown-divider"/>
                    <a className="dropdown-item" href="#logout" onClick={this.onClickLogout}>
                      {i18n.t('navigation.appbar.signOut')}
                    </a>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </nav>

        {/* About info modal */}
        <Modal
          show={isShowAboutModal}
          autoFocus={false}
          onHide={this.hideAboutModal}
        >
          <div
            className="modal-header"
            onMouseEnter={this.onAboutModalHover(`           ${i18n.t('navigation.appbar.about.modelName')}:
            ${systemInformation.modelName}
            ${i18n.t('navigation.appbar.about.software')}:
            ${systemInformation.firmware}
            ${i18n.t('navigation.appbar.about.serialNumber')}:
            ${systemInformation.serialNumber}
            ${i18n.t('navigation.appbar.about.macAddress')}:
            ${networkSettings.mac}`)}
            onMouseLeave={this.onAboutModalHoverOut}
          >
            <h5 className="modal-title">{i18n.t('navigation.appbar.about.about')}</h5>
          </div>
          <div
            ref={this.modelNameRef}
            className="modal-body"
          >
            <div className="text-info mt-2">{i18n.t('navigation.appbar.about.modelName')} :</div>
            <div className="text-primary font-weight-bold">{systemInformation.modelName}</div>
            <div className="text-info mt-3">{i18n.t('navigation.appbar.about.software')} :</div>
            <div className="text-primary font-weight-bold">{systemInformation.firmware}</div>
            <div className="text-info mt-3">{i18n.t('navigation.appbar.about.serialNumber')} :</div>
            <div className="text-primary font-weight-bold">{systemInformation.serialNumber}</div>
            <div className="text-info mt-3">{i18n.t('navigation.appbar.about.macAddress')} :</div>
            <div className="text-primary font-weight-bold">{networkSettings.mac}</div>
          </div>
          <div className="modal-footer flex-column">
            <button
              type="button"
              className="btn btn-info btn-block m-0 rounded-pill"
              onClick={this.hideAboutModal}
            >
              {i18n.t('common.button.close')}
            </button>
          </div>
        </Modal>

        <SessionExpireModal/>

        <RouterView>
          <Loading/>
        </RouterView>
      </>
    );
  }
};
