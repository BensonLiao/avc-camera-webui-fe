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
const iconAudio = require('../../resource/left-navigation-audio.svg');
const iconNotification = require('../../resource/left-navigation-bell.svg');
const iconUserManagement = require('../../resource/left-navigation-users.svg');
const iconAnalytic = require('../../resource/left-navigation-analytic.svg');
const iconNetwork = require('../../resource/left-navigation-network.svg');
const iconSystem = require('../../resource/left-navigation-system.svg');
const iconSDCard = require('../../resource/left-navigation-sd-card.svg');
const logo = require('../../resource/logo-avc.svg');
const CustomTooltip = require('../../core/components/tooltip');
const CustomNotifyModal = require('../../core/components/custom-notify-modal');
const api = require('../../core/apis/web-api');
const store = require('../../core/store');
const Timer = require('../../core/timer');
const _ = require('../../languages');
const constants = require('../../core/constants');

module.exports = class Layout extends Base {
  static get propTypes() {
    return {
      systemInformation: PropTypes.shape({
        languageCode: PropTypes.oneOf(constants.AVAILABLE_LANGUAGE_CODES).isRequired,
        deviceName: PropTypes.string.isRequired,
        isEnableFaceRecognition: PropTypes.bool.isRequired,
        isEnableAgeGender: PropTypes.bool.isRequired,
        isEnableHumanoidDetection: PropTypes.bool.isRequired,
        deviceStatus: PropTypes.oneOf([0, 1]).isRequired,
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
    this.state.isShowExpireModal = false;
    this.state.expireModalBody = _('Your session has expired, redirect in {0} seconds', [constants.REDIRECT_COUNTDOWN]);
    this.countdownTimerID = null;
    this.countdownID = null;
  }

  componentDidMount() {
    const expires = localStorage.getItem(constants.store.EXPIRES) || null;
    if (expires) {
      const expiresTimer = new Timer(
        () => {
          this.setState(
            {isShowExpireModal: true},
            () => {
              let countdown = constants.REDIRECT_COUNTDOWN;
              this.countdownID = setInterval(() => {
                this.setState({expireModalBody: _('Your session has expired, redirect in {0} seconds', [--countdown])});
              }, 1000);
              this.countdownTimerID = setTimeout(() => {
                clearInterval(this.countdownID);
                location.href = '/login';
              }, constants.REDIRECT_COUNTDOWN * 1000);
            }
          );
        },
        expires
      );
      expiresTimer.start();
      store.set(constants.store.EXPIRES_TIMER, expiresTimer);
    }
  }

  showAboutModal = () => {
    this.setState({isShowAboutModal: true});
  };

  hideAboutModal = () => {
    this.setState({isShowAboutModal: false});
  };

  onClickLogout = event => {
    event.preventDefault();
    progress.start();
    api.account.logout()
      .then(() => {
        location.href = '/';
      })
      .finally(progress.done);
  }

  render() {
    const {systemInformation, networkSettings} = this.props;
    const {$user, currentRouteName, isShowAboutModal, isShowExpireModal, expireModalBody} = this.state;
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
            'web.media.word',
            'web.media.privacy-mask'
          ].indexOf(currentRouteName) >= 0,
          'd-flex justify-content-center align-items-center': $user.permission === '0',
          'd-none': $user.permission !== '0'
        }
      ),
      audio: classNames(
        'btn',
        {
          active: currentRouteName === 'web.audio',
          'd-flex justify-content-center align-items-center': $user.permission === '0',
          'd-none': $user.permission !== '0'
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
          'd-flex justify-content-center align-items-center': $user.permission === '0',
          'd-none': $user.permission !== '0'
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
          'd-flex justify-content-center align-items-center': $user.permission === '0',
          'd-none': $user.permission !== '0'
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
          'd-flex justify-content-center align-items-center': $user.permission === '0',
          'd-none': $user.permission !== '0'
        }
      ),
      network: classNames(
        'btn',
        {
          active: currentRouteName.indexOf('web.network') === 0,
          'd-flex justify-content-center align-items-center': $user.permission === '0',
          'd-none': $user.permission !== '0'
        }
      ),
      system: classNames(
        'btn',
        {
          active: currentRouteName.indexOf('web.system') === 0,
          'd-flex justify-content-center align-items-center': $user.permission === '0',
          'd-none': $user.permission !== '0'
        }
      ),
      sdCard: classNames(
        'btn',
        {
          active: currentRouteName === 'web.sd-card',
          'd-flex justify-content-center align-items-center': $user.permission === '0',
          'd-none': $user.permission !== '0'
        }
      )
    };

    return (
      <>
        { $user.permission === '0' && (
          <div className="left-navigation fixed-top">
            <CustomTooltip title={_('Home')}>
              <Link className={classTable.home} to="/">
                <img src={iconHome}/>
              </Link>
            </CustomTooltip>
            <CustomTooltip title={_('Video')}>
              <Link className={classTable.media} to="/media/stream">
                <img src={iconMedia}/>
              </Link>
            </CustomTooltip>
            <CustomTooltip title={_('Audio')}>
              <Link className={classTable.audio} to="/audio">
                <img src={iconAudio}/>
              </Link>
            </CustomTooltip>
            <CustomTooltip title={_('Notification Settings')}>
              <Link className={classTable.notification} to="/notification/smtp">
                <img src={iconNotification}/>
              </Link>
            </CustomTooltip>
            <CustomTooltip title={_('User Management')}>
              <Link className={classTable.users} to="/users/members">
                <img src={iconUserManagement}/>
              </Link>
            </CustomTooltip>
            <CustomTooltip title={_('Analytic')}>
              <Link className={classTable.smart} to="/analytic/face-recognition">
                <img src={iconAnalytic}/>
              </Link>
            </CustomTooltip>
            <CustomTooltip title={_('Network')}>
              <Link className={classTable.network} to="/network/settings">
                <img src={iconNetwork}/>
              </Link>
            </CustomTooltip>
            <CustomTooltip title={_('System')}>
              <Link className={classTable.system} to="/system/datetime">
                <img src={iconSystem}/>
              </Link>
            </CustomTooltip>
            <CustomTooltip title={_('SD Card')}>
              <Link className={classTable.sdCard} to="/sd-card">
                <img src={iconSDCard}/>
              </Link>
            </CustomTooltip>
          </div>
        )}

        <nav className="navbar navbar-expand fixed-top">
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
                    <h5 className="dropdown-header text-primary"> {_('Support')}</h5>
                    <a className="dropdown-item" href="http://www.androvideo.com/contact.aspx" target="_blank" rel="noopener noreferrer">
                      {_('Online Support Request')}
                    </a>
                    <a className="dropdown-item" href="http://www.androvideo.com/download.aspx" target="_blank" rel="noopener noreferrer">
                      {_('Firmware Downloads')}
                    </a>
                    <a className="dropdown-item" href="http://www.androvideo.com/download.aspx" target="_blank" rel="noopener noreferrer">
                      {_('Software Downloads')}
                    </a>
                    <a className="dropdown-item" href="http://www.androvideo.com/download.aspx" target="_blank" rel="noopener noreferrer">
                      {_('Downloads')}
                    </a>
                    <a className="dropdown-item" href="http://www.androvideo.com/products.aspx" target="_blank" rel="noopener noreferrer">
                      {_('Product Selector')}
                    </a>
                    <a className="dropdown-item" href="http://www.androvideo.com/home.aspx" target="_blank" rel="noopener noreferrer">
                      {_('Technical Updates')}
                    </a>
                    <a className="dropdown-item" href="http://www.androvideo.com/download.aspx" target="_blank" rel="noopener noreferrer">
                      {_('Resources')}
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
                      {_(`permission-${$user.permission}`)}
                    </h5>
                    <span className="dropdown-item-text font-weight-bold">{$user.account}</span>
                    <div className="dropdown-divider"/>
                    <a className="dropdown-item" href="#logout" onClick={this.onClickLogout}>
                      {_('Sign Out')}
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
          <div className="modal-header">
            <h5 className="modal-title">{_('About')}</h5>
          </div>
          <div className="modal-body">
            <div className="text-info mt-2">{_('Model Name')} :</div>
            <div className="text-primary font-weight-bold">{systemInformation.modelName}</div>
            <div className="text-info mt-3">{_('Firmware')} :</div>
            <div className="text-primary font-weight-bold">{systemInformation.firmware}</div>
            <div className="text-info mt-3">{_('Serial Number')} :</div>
            <div className="text-primary font-weight-bold">{systemInformation.serialNumber}</div>
            <div className="text-info mt-3">{_('MAC Address')} :</div>
            <div className="text-primary font-weight-bold">{networkSettings.mac}</div>
          </div>
          <div className="modal-footer flex-column">
            <button
              type="button"
              className="btn btn-info btn-block m-0 rounded-pill"
              onClick={this.hideAboutModal}
            >
              {_('Close')}
            </button>
          </div>
        </Modal>

        <CustomNotifyModal
          backdrop="static"
          modalType="info"
          isShowModal={isShowExpireModal}
          modalTitle={_('Session Expired')}
          modalBody={expireModalBody}
          confirmBtnTitle={_('Resume Session')}
          onConfirm={() => {
            api.account.refresh()
              .finally(() => {
                clearTimeout(this.countdownTimerID);
                clearInterval(this.countdownID);
                this.setState({
                  isShowExpireModal: false,
                  expireModalBody: _('Your session has expired, redirect in {0} seconds', [constants.REDIRECT_COUNTDOWN])
                });
              });
          }}
          onHide={() => {
            this.setState({isShowExpireModal: false});
          }}/>

        <RouterView>
          <Loading/>
        </RouterView>
      </>
    );
  }
};
