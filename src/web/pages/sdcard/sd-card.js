const PropTypes = require('prop-types');
const React = require('react');
const {getRouter} = require('capybara-router');
const progress = require('nprogress');
const filesize = require('filesize');
const {Formik, Form, Field} = require('formik');
const Modal = require('react-bootstrap/Modal').default;
const Base = require('../shared/base');
const utils = require('../../../core/utils');
const _ = require('../../../languages');
const api = require('../../../core/apis/web-api');

module.exports = class SDCard extends Base {
  static get propTypes() {
    return {
      systemInformation: PropTypes.shape({
        deviceStatus: PropTypes.oneOf([0, 1]).isRequired,
        usedDiskSize: PropTypes.number.isRequired,
        totalDiskSize: PropTypes.number.isRequired
      }).isRequired,
      sdcardInformation: PropTypes.shape({
        sdEnabled: PropTypes.bool.isRequired,
        sdStatus: PropTypes.number.isRequired,
        sdFormat: PropTypes.string.isRequired
      }),
      smtpSettings: PropTypes.shape({
        isEnableAuth: PropTypes.bool.isRequired
      })
    };
  }

  constructor(props) {
    super(props);
    console.log('this.props', this.props);
    this.state.enableSDCard = true;
    this.state.file = null;
    this.state.isShowModal = false;
    this.state.showSelectModal = {
      isShowAlertModal: false,
      isShowFormatModal: false,
      isShowUnmountModal: false
    };
  }

  showModal = selectedModal => event => {
    event.preventDefault();
    return this.setState({showSelectModal: {[selectedModal]: true}});
  };

  hideModal = selectedModal => _ => {
    return this.setState({showSelectModal: {[selectedModal]: false}});
  };

  alertSDCardModalRender = () => {
    const {$isApiProcessing} = this.state;
    return (
      <Modal
        show={this.state.showSelectModal.isShowAlertModal}
        autoFocus={false}
        onHide={this.hideModal('isShowAlertModal')}
      >
        <Formik
          initialValues={{}}
          onSubmit={this.state}
        >
          <Form>
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">{_('Disable SD Card')}</h4>
              </div>
              <div className="modal-body">
                <p>{_('All micro SD card related services will be disabled. Are you sure you want to continue?')}</p>
              </div>
              <div className="modal-footer flex-column">
                <div className="form-group w-100 mx-0">
                  <button disabled={$isApiProcessing} type="submit" className="btn btn-primary btn-block rounded-pill">{_('Confirm')}</button>
                </div>
                <button type="button" className="btn btn-info btn-block rounded-pill" onClick={this.hideModal('isShowAlertModal')}>{_('Cancel')}</button>
              </div>
            </div>
          </Form>
        </Formik>
      </Modal>
    );
  }

  formatSDcardModalRender = () => {
    const {$isApiProcessing} = this.state;
    return (
      <Modal
        show={this.state.showSelectModal.isShowFormatModal}
        autoFocus={false}
        onHide={this.hideModal('isShowFormatModal')}
      >
        <Formik
          initialValues={{}}
          onSubmit={this.state}
        >
          <Form>
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">{_('Format')}</h4>
              </div>
              <div className="modal-body">
                <p>{_('Are you sure you want to format the Micro SD card?')}</p>
              </div>
              <div className="modal-footer flex-column">
                <div className="form-group w-100 mx-0">
                  <button disabled={$isApiProcessing} type="submit" className="btn btn-primary btn-block rounded-pill">{_('Confirm')}</button>
                </div>
                <button type="button" className="btn btn-info btn-block rounded-pill" onClick={this.hideModal('isShowFormatModal')}>{_('Cancel')}</button>
              </div>
            </div>
          </Form>
        </Formik>
      </Modal>
    );
  };

  unmountSDCardModalRender = () => {
    const {$isApiProcessing} = this.state;
    return (
      <Modal
        show={this.state.showSelectModal.isShowUnmountModal}
        autoFocus={false}
        onHide={this.hideModal('isShowUnmountModal')}
      >
        <Formik
          initialValues={{}}
          onSubmit={this.state}
        >
          <Form>
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">{_('Uninstall')}</h4>
              </div>
              <div className="modal-body">
                <p>{_('Are you sure you want to uninstall the Micro SD card?')}</p>
              </div>
              <div className="modal-footer flex-column">
                <div className="form-group w-100 mx-0">
                  <button disabled={$isApiProcessing} type="submit" className="btn btn-primary btn-block rounded-pill">{_('Confirm')}</button>
                </div>
                <button type="button" className="btn btn-info btn-block rounded-pill" onClick={this.hideModal('isShowUnmountModal')}>{_('Cancel')}</button>
              </div>
            </div>
          </Form>
        </Formik>
      </Modal>
    );
  };

  onSubmitSDcardSettingsForm = values => {
    progress.start();
    api.system.enableSDCard(values)
      .then(getRouter().reload)
      .catch(error => {
        progress.done();
        utils.renderError(error);
      });
  };

  sdcardSettingsFormRender = ({values}) => {
    const {systemInformation, sdcardInformation} = this.props;
    const usedDiskPercentage = Math.ceil((systemInformation.usedDiskSize / systemInformation.totalDiskSize) * 100);

    return (
      <Form className="card-body sdcard">
        <div className="form-group d-flex justify-content-between align-items-center">
          <label className="mb-0">{_('SD Card')}</label>
          <div className="custom-control custom-switch">
            <Field name="enableSDCard" checked={sdcardInformation.sdEnabled} type="checkbox" className="custom-control-input" id="switch-sound"/>
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
                  <button className="btn btn-outline-primary rounded-pill px-5 mr-3" type="button" onClick={this.showModal('isShowFormatModal')}>
                    {_('Format')}
                  </button>
                  {this.formatSDcardModalRender()}
                </span>
                <span>
                  <button className="btn btn-outline-primary rounded-pill px-5" type="button" onClick={this.showModal('isShowUnmountModal')}>
                    {_('Uninstall')}
                  </button>
                  {this.unmountSDCardModalRender()}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="form-group">
          <div className="card">
            <div className="card-body">
              <div className="form-group align-items-center mb-0">
                <label className="mb-0 mr-3">{_('Notification')}</label>
                <a href="#" className="text-primary">Setup Email Notifications</a>
                <div className="custom-control custom-switch float-right">
                  <Field name="isEnableOutput" checked={values.isEnableOutput} type="checkbox" className="custom-control-input" id="switch-output"/>
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
            <label className="mb-o text-primary">{systemInformation.sdStatus}</label>
          </div>
          <hr/>
          <div className="d-flex justify-content-between align-items-center mb-0">
            <label className="mb-o">{_('File Format')}</label>
            <label className="mb-o text-primary">{systemInformation.formatSDCard}</label>
          </div>
          <hr/>
        </div>
        <div className="form-group">
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
                      filesize(systemInformation.totalDiskSize - systemInformation.usedDiskSize),
                      filesize(systemInformation.totalDiskSize)
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

        <button disabled={this.state.$isApiProcessing} type="submit" className="btn btn-block btn-primary rounded-pill mt-5">
          {_('Apply')}
        </button>
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
                    onSubmit={this.onSubmitSDcardSettingsForm}
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
