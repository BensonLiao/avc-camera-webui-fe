const download = require('downloadjs');
const React = require('react');
const progress = require('nprogress');
const {Link, getRouter} = require('capybara-router');
const {Formik, Form, Field} = require('formik');
const Modal = require('react-bootstrap/Modal').default;
const Base = require('../shared/base');
const _ = require('../../../languages');
const utils = require('../../../core/utils');
const api = require('../../../core/apis/web-api');

module.exports = class Maintain extends Base {
  constructor(props) {
    super(props);
    this.state.file = null;
    this.state.isShowModal = false;
  }

  showModal = () => {
    this.setState({isShowModal: true});
  };

  hideModal = () => {
    this.setState({isShowModal: false});
  };

  onChangeFile = event => {
    this.setState({file: event.target.files[0]});
  };

  onSubmitDeviceReboot = () => {
    progress.start();
    api.system.deviceReboot()
      .then(() => new Promise(resolve => {
        // Check the server was shut down.
        const test = () => {
          api.ping()
            .then(() => {
              setTimeout(test, 500);
            })
            .catch(() => {
              resolve();
            });
        };

        test();
      }))
      .then(() => {
        // Redirect to the home page with off-line access.
        location.href = '/';
      })
      .catch(error => {
        progress.done();
        utils.renderError(error);
      });
  };

  onSubmitDeviceReset = ({resetIP}) => {
    progress.start();
    api.system.deviceReset(resetIP)
      .then(getRouter().reload)
      .catch(error => {
        progress.done();
        utils.renderError(error);
      });
  };

  onClickExportDeviceSettings = event => {
    event.preventDefault();
    download('/api/system/device_settings.zip');
  };

  onSubmitImportDeviceSettings = () => {
    const {file} = this.state;

    progress.start();
    api.system.importDeviceSettings(file)
      .then(getRouter().reload)
      .catch(error => {
        progress.done();
        utils.renderError(error);
      });
  };

  deviceRebootFormRender = () => {
    const {$isApiProcessing} = this.state;
    return (
      <Modal
        show={this.state.isShowModal}
        autoFocus={false}
        onHide={this.hideModal}
      >
        <Formik
          initialValues={{}}
          onSubmit={this.onSubmitDeviceReboot}
        >
          <Form>
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">System Reboot</h4>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to reboot the system?</p>
              </div>
              <div className="modal-footer flex-column">
                <div className="form-group w-100 mx-0">
                  <button disabled={$isApiProcessing} type="submit" className="btn btn-primary btn-block rounded-pill">Confirm</button>
                </div>
                <button type="button" className="btn btn-info btn-block rounded-pill" onClick={this.hideModal}>Cancel</button>
              </div>
            </div>
          </Form>
        </Formik>
      </Modal>
    );
  };

  deviceResetFormRender = () => {
    return (
      <Form>
        <div className="form-group">
          <label>{_('Restore to Default Setting')}</label>
          <div className="form-check mb-2">
            <Field type="checkbox" name="resetIP" className="form-check-input" id="input-checkbox-reset-all"/>
            <label className="form-check-label" htmlFor="input-checkbox-reset-all">
              {_('Restore to factory default setting (Includes IP Address)')}
            </label>
          </div>
          <div>
            <button className="btn btn-outline-primary rounded-pill px-5" type="submit">{_('Reset')}</button>
          </div>
        </div>
      </Form>
    );
  };

  importDeviceSettingsFormRender = () => {
    const {$isApiProcessing, file} = this.state;

    return (
      <Form>
        <div className="form-group">
          <label className="mb-0">{_('Import System Settings')}</label>
          <small className="form-text text-muted my-2">{_('Only .Zip File Supported')}</small>
          <div>
            <label className="btn btn-outline-primary rounded-pill font-weight-bold px-5">
              <input type="file" className="d-none" accept=".zip" onChange={this.onChangeFile}/>
              {_('Select File')}
            </label>
            {
              file ?
                <span className="text-size-14 text-muted ml-3">{_(file.name)}</span> :
                <span className="text-size-14 text-muted ml-3">{_('No Files Selected')}</span>
            }
          </div>
          <div>
            <button disabled={$isApiProcessing || !file} className="btn btn-outline-primary rounded-pill px-5" type="submit">{_('Import')}</button>
          </div>
        </div>
      </Form>
    );
  };

  render() {
    return (
      <div className="main-content left-menu-active">
        <div className="page-system">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <nav>
                  <ol className="breadcrumb rounded-pill">
                    <li className="breadcrumb-item active">
                      <Link to="/system">{_('System')}</Link>
                    </li>
                    <li className="breadcrumb-item active">
                      <Link to="/system/date">{_('Settings')}</Link>
                    </li>
                    <li className="breadcrumb-item">{_('Device Maintenace')}</li>
                  </ol>
                </nav>
              </div>

              <div className="col-center">
                <div className="card shadow">
                  <div className="card-header">{_('Device Maintenace')}</div>
                  <div className="card-body">
                    <div className="form-group">
                      <label>{_('System Reboot')}</label>
                      <div>
                        <button className="btn btn-outline-primary rounded-pill px-5" type="button" onClick={this.showModal}>
                          {_('Reboot')}
                        </button>
                      </div>
                    </div>
                    {this.deviceRebootFormRender()}
                    <Formik
                      initialValues={{resetIP: false}}
                      onSubmit={this.onSubmitDeviceReset}
                    >
                      {this.deviceResetFormRender}
                    </Formik>
                    <div className="form-group">
                      <label>{_('Export System Settings')}</label>
                      <div>
                        <button className="btn btn-outline-primary rounded-pill px-5" type="button" onClick={this.onClickExportDeviceSettings}>{_('Export')}</button>
                      </div>
                    </div>
                    <Formik
                      initialValues={{}}
                      onSubmit={this.onSubmitImportDeviceSettings}
                    >
                      {this.importDeviceSettingsFormRender}
                    </Formik>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
