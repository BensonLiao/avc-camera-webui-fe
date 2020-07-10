const Base = require('./shared/base');
const React = require('react');
const axios = require('axios');
const ReactDOM = require('react-dom');
const PropTypes = require('prop-types');
const api = require('../../core/apis/web-api');
const store = require('../../core/store');
const notify = require('../../core/notify');
const constants = require('../../core/constants');
const CustomNotifyModal = require('../../core/components/custom-notify-modal');
const Timer = require('../../core/timer');
const _ = require('../../languages');

axios.interceptors.response.use(
  config => config,
  error => {
    if (error.response.status === 408 || error.code === 'ECONNABORTED') {
      console.log(`A timeout happend on url ${error.config.url}`);
    }

    return Promise.reject(error);
  }
);

module.exports = class Mjpeg extends Base {
  static get propTypes() {
    return {
      params: PropTypes.shape({
        res: PropTypes.oneOf(['half', 'full']),
        quality: PropTypes.string
      })
    };
  }

  constructor(props) {
    super(props);
    this.state.streamImageUrl = null;
    this.state.isShowAboutModal = false;
    this.state.isShowExpireModal = false;
    this.state.expireModalBody = _('Your session has expired, redirect in {0} seconds', [constants.REDIRECT_COUNTDOWN]);
    this.countdownTimerID = null;
    this.countdownID = null;
    store.set(`${this.constructor.name}.isPlayStream`, true);
  }

  componentDidMount() {
    const {params} = this.props;
    if (!Object.values(params).some(query => query === undefined)) {
      api.updateMjpeg(params);
    }

    this.fetchSnapshot();
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

  componentWillUnmount() {
    store.set(`${this.constructor.name}.isPlayStream`, false);
  }

  fetchSnapshot = () => {
    if (store.get(`${this.constructor.name}.isPlayStream`)) {
      axios.get('/api/mjpeg-snapshot', {responseType: 'blob'})
        .then(response => {
          if (this.state.streamImageUrl) {
            window.URL.revokeObjectURL(this.state.streamImageUrl);
          }

          const imageUrl = window.URL.createObjectURL(response.data);
          this.setState({streamImageUrl: imageUrl}, this.fetchSnapshot);
        })
        .catch(error => {
          if (error && error.response && error.response.status === 401) {
            location.href = '/login';
          }
        });
    }
  };

  render() {
    const mount = document.body;
    const {isShowExpireModal, expireModalBody} = this.state;
    return ReactDOM.createPortal(
      <>
        <div style={{textAlign: 'center'}}>
          <img
            className="img-fluid" style={{height: '100vh'}} src={this.state.streamImageUrl}/>
        </div>
        <CustomNotifyModal
          modalType="info"
          isShowModal={isShowExpireModal}
          modalTitle={_('Session Expired')}
          modalBody={expireModalBody}
          confirmBtnTitle={_('Resume Session')}
          onConfirm={() => {
            api.account.refresh()
              .then(() => {
                clearInterval(this.countdownID);
                clearTimeout(this.countdownTimerID);
                this.setState({isShowExpireModal: false});
              })
              .catch(error => {
                notify.showErrorNotification({
                  title: `Error ${error.response.status}` || null,
                  message: error.response.status === 400 ? error.response.data.message || null : null
                });
              });
          }}
          onHide={() => {
            this.setState({isShowExpireModal: false});
          }}/>
      </>
      ,
      mount
    );
  }
};
