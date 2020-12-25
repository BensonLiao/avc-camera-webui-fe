const React = require('react');
const i18n = require('../../i18n').default;
const api = require('../apis/web-api');
const notify = require('../notify');
const store = require('../store');
const CustomNotifyModal = require('./custom-notify-modal');
const Timer = require('../timer');
const constants = require('../constants');

module.exports = class SessionExpireModal extends React.PureComponent {
  state = {
    isShowModal: false,
    countDown: constants.REDIRECT_COUNTDOWN
  }

  componentDidMount() {
    const expires = localStorage.getItem(constants.store.EXPIRES) || null;
    if (expires) {
      const expiresTimer = new Timer(
        () => {
          this.setState({isShowModal: true},
            () => {
              let countdown = constants.REDIRECT_COUNTDOWN;
              this.countdownID = setInterval(() => this.setState({countDown: --countdown}), 1000);
              this.countdownTimerID = setTimeout(() => {
                store.set(constants.store.IS_NOT_CALL_UNLOAD_ALERT, true);
                clearInterval(this.countdownID);
                api.account.logout()
                  .then(() => {
                    location.href = '/';
                  });
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

  render() {
    const {isShowModal, countDown} = this.state;
    return (
      <CustomNotifyModal
        modalType="info"
        backdrop="static"
        isShowModal={isShowModal}
        modalTitle={i18n.t('common.modal.sessionExpire.sessionExpired')}
        modalBody={i18n.t('common.modal.sessionExpire.expireCountdown', {0: countDown})}
        confirmBtnTitle={i18n.t('common.modal.sessionExpire.renewSession')}
        onConfirm={() => {
          api.account.refresh()
            .then(() => {
              clearInterval(this.countdownID);
              clearTimeout(this.countdownTimerID);
              this.setState({isShowModal: false});
            })
            .catch(error => {
              notify.showErrorNotification({
                title: `Error ${error.response.status}` || null,
                message: error.response.status === 400 ? error.response.data.message || null : null
              });
            });
        }}
        onHide={() => this.setState({isShowModal: false})}
      />
    );
  }
};

