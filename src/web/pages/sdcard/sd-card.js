const PropTypes = require('prop-types');
const React = require('react');
const classNames = require('classnames');
const {Link, getRouter} = require('capybara-router');
const progress = require('nprogress');
const {Formik, Form, Field} = require('formik');
const FormikEffect = require('../../../core/components/formik-effect');
const Base = require('../shared/base');
const _ = require('../../../languages');
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

  onSubmitFormatSDCard = () => {
    progress.start();
    api.system.formatSDCard()
      .then(getRouter().reload)
      .finally(progress.done);
  };

  onSubmitUnmountSDCard = () => {
    progress.start();
    api.system.unmountSDCard()
      .then(getRouter().reload)
      .finally(progress.done);
  };

  onSubmitDisableSDCard = () => {
    progress.start();
    api.system.enableSD({sdEnabled: false})
      .then(getRouter().reload)
      .finally(progress.done);
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
        .finally(progress.done);
    }

    if (`${prevValues.sdAlertEnabled}` !== `${nextValues.sdAlertEnabled}`) {
      progress.start();
      api.system.sdCardAlert(nextValues)
        .then(getRouter().reload)
        .finally(progress.done);
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
        modalBody: [_('• Are you sure you want to disable the Micro SD card?'), _('• Event photos will not be available after disabling')]
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
                <CustomTooltip show={sdEnabled} title={_('Please Disable SD Card First')}>
                  <span>
                    <button
                      className="btn btn-outline-primary rounded-pill px-5 mr-3"
                      type="button"
                      disabled={sdEnabled}
                      style={sdEnabled ? {pointerEvents: 'none'} : {}}
                      onClick={this.showModal('isShowFormatModal')}
                    >
                      {_('Format')}
                    </button>
                    {this.sdcardModalRender('format')}
                  </span>
                </CustomTooltip>
                <CustomTooltip show={sdEnabled} title={_('Please Disable SD Card First')}>
                  <span>
                    <button
                      className="btn btn-outline-primary rounded-pill px-5"
                      type="button"
                      disabled={sdEnabled}
                      style={sdEnabled ? {pointerEvents: 'none'} : {}}
                      onClick={this.showModal('isShowUnmountModal')}
                    >
                      {_('Unmount')}
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
                <label className="mb-0 mr-3">{_('SD Card Notification')}</label>
                <span>
                  {
                    isEnableAuth ?
                      <a className="text-success">{_('Email Notification Set')}</a> :
                      <Link className="text-danger" to="/notification/smtp">{_('Setup Email Notifications')}</Link>
                  }
                </span>
                <CustomTooltip show={!isEnableAuth} title={_('Please Setup Email Notifications')}>
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
                      <span>{_('ON')}</span>
                      <span>{_('OFF')}</span>
                    </label>
                  </div>
                </CustomTooltip>
              </div>
            </div>
          </div>
        </div>
        <div className="form-group px-3">
          <div className="d-flex justify-content-between align-items-center mb-0">
            <label className="mb-o">{_('Status')}</label>
            <label className="mb-o text-primary">{_(SD_STATUS_LIST[sdStatus] || 'UNKNOWN STATUS')}
            </label>
          </div>
          <hr/>
          <div className="d-flex justify-content-between align-items-center mb-0">
            <label className="mb-o">{_('File Format')}</label>
            <label className="mb-o text-primary">{sdFormat}</label>
          </div>
          <hr/>
        </div>
        <div className={classNames('form-group', sdStatus === 0 ? '' : 'd-none')}>
          <div className="card">
            <div className="card-header sd-card-round">
              {_('Storage Space')}
            </div>
            <div className="card-body">
              <div className="form-group mb-0">
                <label className="mb-3">{_('SD Card')}</label>
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
                path={[_('SD Card Settings')]}
              />
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
