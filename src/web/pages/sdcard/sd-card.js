const PropTypes = require('prop-types');
const React = require('react');
const classNames = require('classnames');
const {Link, getRouter} = require('capybara-router');
const progress = require('nprogress');
const filesize = require('filesize');
const {Formik, Form, Field} = require('formik');
const FormikEffect = require('../../../core/components/formik-effect');
const Base = require('../shared/base');
const utils = require('../../../core/utils');
const _ = require('../../../languages');
const api = require('../../../core/apis/web-api');
const {SD_STATUS_LIST} = require('../../../core/constants');
const CustomNotifyModal = require('../../../core/components/custom-notify-modal');

module.exports = class SDCard extends Base {
  static get propTypes() {
    return {
      systemInformation: PropTypes.shape({
        sdEnabled: PropTypes.bool.isRequired,
        sdStatus: PropTypes.number.isRequired,
        sdFormat: PropTypes.string.isRequired,
        sdTotal: PropTypes.number.isRequired,
        sdUsage: PropTypes.number.isRequired,
        sdAlertEnabled: PropTypes.bool.isRequired
      }).isRequired,
      smtpSettings: PropTypes.shape({
        isEnableAuth: PropTypes.bool.isRequired
      }).isRequired
    };
  }

  constructor(props) {
    super(props);
    this.state.sdEnabled = null;
    this.state.file = null;
    this.state.showSelectModal = {
      isShowFormatModal: false,
      isShowUnmountModal: false,
      isShowDisableModal: false
    };
  }

  showModal = selectedModal => event => {
    event.preventDefault();
    return this.setState(prevState => ({
      showSelectModal: {
        ...prevState.showSelectModal,
        [selectedModal]: true
      }
    }));
  };

  onSubmitFormatSDCard = () => {
    progress.start();
    api.system.formatSDCard()
      .then(getRouter().reload)
      .catch(error => {
        progress.done();
        utils.showErrorNotification({
          title: `Error ${error.response.status}` || null,
          message: error.response.status === 400 ? error.response.data.message || null : null
        });
      });
  };

  onSubmitUnmountSDCard = () => {
    progress.start();
    api.system.unmountSDCard()
      .then(getRouter().reload)
      .catch(error => {
        progress.done();
        utils.showErrorNotification({
          title: `Error ${error.response.status}` || null,
          message: error.response.status === 400 ? error.response.data.message || null : null
        });
      });
  };

  onSubmitDisableSDCard = () => {
    progress.start();
    api.system.enableSD({sdEnabled: false})
      .then(getRouter().reload)
      .catch(error => {
        progress.done();
        utils.showErrorNotification({
          title: `Error ${error.response.status}` || null,
          message: error.response.status === 400 ? error.response.data.message || null : null
        });
      });
  };

  onChangeSdCardSetting = ({nextValues, prevValues}) => {
    if (prevValues.sdEnabled && !nextValues.sdEnabled) {
      this.setState(prevState => ({
        showSelectModal: {
          ...prevState.showSelectModal,
          isShowDisableModal: true
        }
      }));
    }

    if (!prevValues.sdEnabled && nextValues.sdEnabled) {
      progress.start();
      api.system.enableSD(nextValues)
        .then(getRouter().reload)
        .catch(error => {
          progress.done();
          utils.showErrorNotification({
            title: `Error ${error.response.status}` || null,
            message: error.response.status === 400 ? error.response.data.message || null : null
          });
        });
    }

    if (`${prevValues.sdAlertEnabled}` !== `${nextValues.sdAlertEnabled}`) {
      progress.start();
      api.system.sdCardAlert(nextValues)
        .then(getRouter().reload)
        .catch(error => {
          progress.done();
          utils.showErrorNotification({
            title: `Error ${error.response.status}` || null,
            message: error.response.status === 400 ? error.response.data.message || null : null
          });
        });
    }
  };

  sdcardModalRender = mode => {
    const {$isApiProcessing} = this.state;

    const modalType = {
      format: {
        showModal: this.state.showSelectModal.isShowFormatModal,
        modalOnSubmit: this.onSubmitFormatSDCard,
        modalTitle: _('Format'),
        modalBody: _('Are you sure you want to format the Micro SD card?')
      },
      unmount: {
        showModal: this.state.showSelectModal.isShowUnmountModal,
        modalOnSubmit: this.onSubmitUnmountSDCard,
        modalTitle: _('Unmount'),
        modalBody: _('Are you sure you want to unmount the Micro SD card?')
      },
      disable: {
        showModal: this.state.showSelectModal.isShowDisableModal,
        modalOnSubmit: this.onSubmitDisableSDCard,
        modalTitle: _('Disable'),
        modalBody: _('Are you sure you want to disable the Micro SD card?')
      }
    };
    return (
      <CustomNotifyModal
        isShowModal={modalType[mode].showModal}
        modalTitle={modalType[mode].modalTitle}
        modalBody={modalType[mode].modalBody}
        isConfirmDisable={$isApiProcessing}
        onHide={getRouter().reload} // Reload to reset SD card switch button state
        onConfirm={modalType[mode].modalOnSubmit}/>
    );
  }

  sdcardSettingsFormRender = () => {
    const {systemInformation, smtpSettings: {isEnableAuth}} = this.props;
    const usedDiskPercentage = Math.ceil((systemInformation.sdUsage / systemInformation.sdTotal) * 100);
    return (
      <Form className="card-body sdcard">
        <FormikEffect onChange={this.onChangeSdCardSetting}/>
        <div className="form-group d-flex justify-content-between align-items-center">
          <label className="mb-0">{_('SD Card')}</label>
          <div className="custom-control custom-switch">
            <Field
              name="sdEnabled"
              type="checkbox"
              className="custom-control-input"
              id="switch-sound"
            />
            <label className="custom-control-label" htmlFor="switch-sound">
              <span>{_('ON')}</span>
              <span>{_('OFF')}</span>
            </label>
          </div>
        </div>
        <div className="form-group">
          <div className="card">
            <div className="card-body">
              <label>{_('SD Card Operation')}</label>
              <div>
                <span>
                  <button
                    className="btn btn-outline-primary rounded-pill px-5 mr-3"
                    type="button"
                    disabled={systemInformation.sdEnabled}
                    onClick={this.showModal('isShowFormatModal')}
                  >
                    {_('Format')}
                  </button>
                  {this.sdcardModalRender('format')}
                </span>
                <span>
                  <button
                    className="btn btn-outline-primary rounded-pill px-5"
                    type="button"
                    disabled={systemInformation.sdEnabled}
                    onClick={this.showModal('isShowUnmountModal')}
                  >
                    {_('Unmount')}
                  </button>
                  {this.sdcardModalRender('unmount')}
                </span>
                <span>
                  {this.sdcardModalRender('disable')}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="form-group">
          <div className="card">
            <div className="card-body">
              <div className="form-group align-items-center mb-0">
                <label className="mb-0 mr-3">{_('SD Card Notification')}</label>
                <span>
                  {
                    isEnableAuth ?
                      <a className="text-success">{_('Email Notification Set')}</a> :
                      <Link className="text-danger" to="/notification/smtp">{_('Setup Email Notifications')}</Link>
                  }
                </span>
                <div className="custom-control custom-switch float-right">
                  <Field disabled={!isEnableAuth} name="sdAlertEnabled" type="checkbox" className="custom-control-input" id="switch-output"/>
                  <label className="custom-control-label" htmlFor="switch-output">
                    <span>{_('ON')}</span>
                    <span>{_('OFF')}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="form-group px-3">
          <div className="d-flex justify-content-between align-items-center mb-0">
            <label className="mb-o">{_('Status')}</label>
            <label className="mb-o text-primary">{_(SD_STATUS_LIST[systemInformation.sdStatus] || 'UNKNOWN STATUS')}
            </label>
          </div>
          <hr/>
          <div className="d-flex justify-content-between align-items-center mb-0">
            <label className="mb-o">{_('File Format')}</label>
            <label className="mb-o text-primary">{systemInformation.sdFormat}</label>
          </div>
          <hr/>
        </div>
        <div className={classNames('form-group', systemInformation.sdStatus === 1 ? '' : 'd-none')}>
          <div className="card">
            <div className="card-header sd-card-round">
              {_('Storage Space')}
            </div>
            <div className="card-body">
              <div className="form-group mb-0">
                <label className="mb-3">{_('SD Card')}</label>
                <p>
                  {
                    _('Free: {0}, Total: {1}', [
                      filesize(systemInformation.sdTotal - systemInformation.sdUsage),
                      filesize(systemInformation.sdTotal)
                    ])
                  }
                </p>
                <div className="progress">
                  {
                    isNaN(usedDiskPercentage) ?
                      <div className="progress-bar"/> :
                      <div className="progress-bar" style={{width: `${usedDiskPercentage}%`}}>
                        {`${usedDiskPercentage}%`}
                      </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </Form>
    );
  };

  render() {
    const {systemInformation} = this.props;
    return (
      <div className="main-content">
        <div className="section-media">
          <div className="container-fluid">
            <div className="row justify-content-center">
              <div className="col-12 px-0">
                <nav>
                  <ol className="breadcrumb rounded-pill">
                    <li className="breadcrumb-item">{_('SD Card')}</li>
                  </ol>
                </nav>
              </div>
              <div className="col-center">
                <div className="card shadow">
                  <div className="card-header">{_('SD Card Settings')}</div>
                  <Formik
                    initialValues={systemInformation}
                  >
                    {this.sdcardSettingsFormRender}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
