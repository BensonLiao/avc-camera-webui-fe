const PropTypes = require('prop-types');
const React = require('react');
const classNames = require('classnames');
const {Link, getRouter} = require('capybara-router');
const progress = require('nprogress');
const {Formik, Form, Field} = require('formik');
const FormikEffect = require('../../../core/components/formik-effect');
const Base = require('../shared/base');
const i18n = require('../../i18n').default;
const api = require('../../../core/apis/web-api');
const {SD_STATUS_LIST} = require('../../../core/constants');
const CustomNotifyModal = require('../../../core/components/custom-notify-modal');
const CustomTooltip = require('../../../core/components/tooltip');
const VolumeProgressBar = require('../../../core/components/volume-progress-bar');
const BreadCrumb = require('../../../core/components/fields/breadcrumb').default;

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
      smtpSettings: PropTypes.shape({isEnableAuth: PropTypes.bool.isRequired}).isRequired
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

  callApi = (apiFunction, value = '') => {
    progress.start();
    api.system[apiFunction](value)
      .then(getRouter().reload)
      .finally(progress.done);
  }

  onChangeSdCardSetting = ({nextValues, prevValues}) => {
    if (prevValues.sdEnabled && !nextValues.sdEnabled) {
      return this.setState(prevState => ({
        showSelectModal: {
          ...prevState.showSelectModal,
          isShowDisableModal: true
        }
      }));
    }

    if (!prevValues.sdEnabled && nextValues.sdEnabled) {
      return this.callApi('enableSD', {sdEnabled: nextValues.sdEnabled});
    }

    if (`${prevValues.sdAlertEnabled}` !== `${nextValues.sdAlertEnabled}`) {
      return this.callApi('sdCardAlert', {sdAlertEnabled: nextValues.sdAlertEnabled});
    }
  };

  sdcardModalRender = mode => {
    const {$isApiProcessing, showSelectModal: {isShowFormatModal, isShowUnmountModal, isShowDisableModal}} = this.state;

    const modalType = {
      format: {
        showModal: isShowFormatModal,
        modalOnSubmit: () => this.callApi('formatSDCard'),
        modalTitle: i18n.t('Format'),
        modalBody: i18n.t('Are you sure you want to format the Micro SD card?')
      },
      unmount: {
        showModal: isShowUnmountModal,
        modalOnSubmit: () => this.callApi('unmountSDCard'),
        modalTitle: i18n.t('Unmount'),
        modalBody: i18n.t('Are you sure you want to unmount the Micro SD card?')
      },
      disable: {
        showModal: isShowDisableModal,
        modalOnSubmit: () => this.callApi('enableSD', {sdEnabled: false}),
        modalTitle: i18n.t('Disabling SD Card'),
        modalBody: [i18n.t('Event photos will not be available after the SD card is disabled. Are you sure you want to continue?')]
      }
    };
    return (
      <CustomNotifyModal
        isShowModal={modalType[mode].showModal}
        modalTitle={modalType[mode].modalTitle}
        modalBody={modalType[mode].modalBody}
        isConfirmDisable={$isApiProcessing}
        onHide={getRouter().reload} // Reload to reset SD card switch button state
        onConfirm={modalType[mode].modalOnSubmit}
      />
    );
  }

  sdcardSettingsFormRender = () => {
    const {
      systemInformation: {
        sdUsage,
        sdTotal,
        sdStatus,
        sdEnabled,
        sdFormat
      }, smtpSettings: {isEnableAuth}
    } = this.props;
    return (
      <Form className="card-body sdcard">
        <FormikEffect onChange={this.onChangeSdCardSetting}/>
        <div className="form-group d-flex justify-content-between align-items-center">
          <label className="mb-0">{i18n.t('Enable SD Card')}</label>
          <div className="custom-control custom-switch">
            <Field
              name="sdEnabled"
              type="checkbox"
              className="custom-control-input"
              id="switch-sound"
              disabled={sdStatus}
            />
            <label className={classNames('custom-control-label', {'custom-control-label-disabled': sdStatus})} htmlFor="switch-sound">
              <span>{i18n.t('ON')}</span>
              <span>{i18n.t('OFF')}</span>
            </label>
          </div>
        </div>
        <div className="form-group">
          <div className="card">
            <div className="card-body">
              <label>{i18n.t('Operation')}</label>
              <div>
                <CustomTooltip show={sdEnabled} title={i18n.t('Please disable the SD card first.')}>
                  <span style={sdEnabled || sdStatus ? {cursor: 'not-allowed'} : {}}>
                    <button
                      className="btn btn-outline-primary rounded-pill px-5 mr-3"
                      type="button"
                      disabled={sdEnabled || sdStatus}
                      style={sdEnabled || sdStatus ? {pointerEvents: 'none'} : {}}
                      onClick={this.showModal('isShowFormatModal')}
                    >
                      {i18n.t('Format')}
                    </button>
                    {this.sdcardModalRender('format')}
                  </span>
                </CustomTooltip>
                <CustomTooltip show={sdEnabled} title={i18n.t('Please disable the SD card first.')}>
                  <span style={sdEnabled ? {cursor: 'not-allowed'} : {}}>
                    <button
                      className="btn btn-outline-primary rounded-pill px-5"
                      type="button"
                      disabled={sdEnabled || this.state.$isApiProcessing}
                      style={sdEnabled ? {pointerEvents: 'none'} : {}}
                      onClick={sdStatus ? () => (this.callApi('mountSDCard')) : this.showModal('isShowUnmountModal')}
                    >
                      {sdStatus ? i18n.t('Mount') : i18n.t('Unmount')}
                    </button>
                    {this.sdcardModalRender('unmount')}
                  </span>
                </CustomTooltip>
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
                <label className="mb-0 mr-3">{i18n.t('Error Notification')}</label>
                <span>
                  {
                    isEnableAuth ?
                      <a className="text-success">{i18n.t('Email Notification Set')}</a> :
                      <Link className="text-danger" to="/notification/smtp">{i18n.t('Enable Outgoing Email')}</Link>
                  }
                </span>
                <CustomTooltip show={!isEnableAuth} title={i18n.t('Please enable outgoing email first.')}>
                  <div className="custom-control custom-switch float-right">
                    <Field
                      disabled={!isEnableAuth}
                      name="sdAlertEnabled"
                      type="checkbox"
                      style={isEnableAuth ? {} : {pointerEvents: 'none'}}
                      className="custom-control-input"
                      id="switch-output"
                    />
                    <label className="custom-control-label" htmlFor="switch-output">
                      <span>{i18n.t('ON')}</span>
                      <span>{i18n.t('OFF')}</span>
                    </label>
                  </div>
                </CustomTooltip>
              </div>
            </div>
          </div>
        </div>
        <div className="form-group px-3">
          <div className="d-flex justify-content-between align-items-center mb-0">
            <label className="mb-o">{i18n.t('Status')}</label>
            <label className="mb-o text-primary">{i18n.t(SD_STATUS_LIST[sdStatus] || 'UNKNOWN STATUS')}
            </label>
          </div>
          <hr/>
          <div className="d-flex justify-content-between align-items-center mb-0">
            <label className="mb-o">{i18n.t('Filesystem')}</label>
            <label className="mb-o text-primary">{sdFormat}</label>
          </div>
          <hr/>
        </div>
        <div className={classNames('form-group', sdStatus ? 'd-none' : '')}>
          <div className="card">
            <div className="card-header sd-card-round">
              {i18n.t('Storage Space')}
            </div>
            <div className="card-body">
              <div className="form-group mb-0">
                <label className="mb-3">{i18n.t('SD Card')}</label>
                <VolumeProgressBar
                  total={sdTotal}
                  usage={sdUsage}
                  percentageToHideText={4}
                />
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
              <BreadCrumb
                className="px-0"
                path={[i18n.t('SD Card')]}
              />
              <div className="col-center">
                <div className="card shadow">
                  <div className="card-header">{i18n.t('SD Card')}</div>
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
