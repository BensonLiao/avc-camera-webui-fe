const download = require('downloadjs');
const React = require('react');
const progress = require('nprogress');
const {Link} = require('capybara-router');
const {Formik, Form, Field} = require('formik');
const Base = require('../shared/base');
const _ = require('../../../languages');
const utils = require('../../../core/utils');
const api = require('../../../core/apis/web-api');
const ConfirmModal = require('../../../core/components/confirm-modal');
const ApiProcessModal = require('../../../core/components/api-process-modal');

module.exports = class Maintain extends Base {
  constructor(props) {
    super(props);
    this.state.file = null;
    this.state.isShowApiProcessModal = false;
    this.state.apiProcessModalTitle = 'Device processing, please wait...';
    this.state.isShowSelectModal = {
      reboot: false,
      reset: false,
      resetFinished: false
    };
  }

  hideApiProcessModal = () => {
    this.setState({isShowApiProcessModal: false});
  };

  showModal = selectedModal => event => {
    event.preventDefault();
    return this.setState(prevState => ({
      isShowSelectModal: {
        ...prevState.isShowSelectModal,
        [selectedModal]: true
      }
    }));
  };

  hideModal = selectedModal => _ => {
    return this.setState(prevState => ({
      isShowSelectModal: {
        ...prevState.isShowSelectModal,
        [selectedModal]: false
      }
    }));
  };

  onChangeFile = event => {
    this.setState({file: event.target.files[0]});
  };

  onSubmitDeviceReboot = () => {
    progress.start();
    this.setState(prevState => ({
      isShowApiProcessModal: true,
      isShowSelectModal: {
        ...prevState.isShowSelectModal,
        reboot: false
      }
    }), () => {
      api.system.deviceReboot()
        .then(() => new Promise(resolve => {
          // Check the server was shut down, if success then shutdown was failed and retry.
          const test = () => {
            api.ping('web')
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
          // Keep modal and update the title.
          this.setState({apiProcessModalTitle: 'Device rebooting, please wait...'});
          // Check the server was start up, if success then startup was failed and retry.
          const test = () => {
            api.ping('app')
              .then(() => {
                location.reload();
              })
              .catch(() => {
                setTimeout(test, 1000);
              });
          };

          test();
        })
        .catch(error => {
          progress.done();
          this.hideApiProcessModal();
          utils.showErrorNotification({
            title: `Error ${error.response.status}` || null,
            message: error.response.status === 400 ? error.response.data.message || null : null
          });
        });
    });
  };

  onSubmitDeviceReset = ({resetIP}) => {
    progress.start();
    this.setState(prevState => ({
      isShowApiProcessModal: true,
      isShowSelectModal: {
        ...prevState.isShowSelectModal,
        reset: false
      },
      apiProcessModalTitle: 'Device resetting, please wait...'
    }),
    () => {
      api.system.deviceReset(resetIP)
        .then(api.account.logout())
        .then(() => {
          progress.done();
          this.hideApiProcessModal();
          this.setState(prevState => ({
            isShowSelectModal: {
              ...prevState.isShowSelectModal,
              resetFinished: true
            }
          }));
        })
        .catch(error => {
          progress.done();
          this.hideApiProcessModal();
          utils.showErrorNotification({
            title: `Error ${error.response.status}` || null,
            message: error.response.status === 400 ? error.response.data.message || null : null
          });
        });
    });
  };

  onClickExportDeviceSettings = event => {
    event.preventDefault();
    download('/api/system/device_settings.zip');
  };

  onSubmitImportDeviceSettings = () => {
    const {file} = this.state;
    progress.start();
    this.setState({
      isShowApiProcessModal: true,
      apiProcessModalTitle: 'Device settings importing, please wait...'
    },
    () => {
      api.system.importDeviceSettings(file)
        .then(() => {
          api.system.deviceReboot()
            .then(() => new Promise(resolve => {
              // Check the server was shut down, if success then shutdown was failed and retry.
              const test = () => {
                api.ping('web')
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
              // Keep modal and update the title.
              this.setState({apiProcessModalTitle: 'Device rebooting, please wait...'});
              // Check the server was start up, if success then startup was failed and retry.
              const test = () => {
                api.ping('app')
                  .then(() => {
                    location.reload();
                  })
                  .catch(() => {
                    setTimeout(test, 1000);
                  });
              };

              test();
            })
            .catch(error => {
              progress.done();
              this.hideApiProcessModal();
              utils.showErrorNotification({
                title: `Error ${error.response.status}` || null,
                message: error.response.status === 400 ? error.response.data.message || null : null
              });
            });
        })
        .catch(error => {
          progress.done();
          this.hideApiProcessModal();
          utils.showErrorNotification({
            title: `Error ${error.response.status}` || null,
            message: error.response.status === 400 ? error.response.data.message || null : null
          });
        });
    });
  };

  deviceResetFormRender = ({values}) => {
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
          <ConfirmModal
            isShowModal={this.state.isShowSelectModal.reset}
            modalTitle="System Reset"
            modalBody="Are you sure you want to reset the system?"
            isConfirmDisable={this.state.$isApiProcessing}
            onHide={this.hideModal('reset')}
            onConfirm={() => {
              this.onSubmitDeviceReset(values);
            }}/>
          <div>
            <button className="btn btn-outline-primary rounded-pill px-5" type="button" onClick={this.showModal('reset')}>{_('Reset')}</button>
          </div>
        </div>
      </Form>
    );
  };

  importDeviceSettingsFormRender = () => {
    const {$isApiProcessing, file} = this.state;

    return (
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
          <button disabled={$isApiProcessing || !file} className="btn btn-outline-primary rounded-pill px-5" type="button" onClick={this.onSubmitImportDeviceSettings}>{_('Import')}</button>
        </div>
      </div>
    );
  };

  render() {
    const {$isApiProcessing, isShowSelectModal} = this.state;
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

              <ApiProcessModal
                isShowModal={this.state.isShowApiProcessModal}
                modalTitle={this.state.apiProcessModalTitle}
                onHide={this.hideApiProcessModal}/>

              <div className="col-center">
                <div className="card shadow">
                  <div className="card-header">{_('Device Maintenace')}</div>
                  <div className="card-body">
                    <div className="form-group">
                      <label>{_('System Reboot')}</label>
                      <div>
                        <button className="btn btn-outline-primary rounded-pill px-5" type="button" onClick={this.showModal('reboot')}>
                          {_('Reboot')}
                        </button>
                      </div>
                    </div>
                    <ConfirmModal
                      isShowModal={isShowSelectModal.reboot}
                      modalTitle="System Reboot"
                      modalBody="Are you sure you want to reboot the system?"
                      isConfirmDisable={$isApiProcessing}
                      onHide={this.hideModal('reboot')}
                      onConfirm={this.onSubmitDeviceReboot}/>
                    <Formik
                      initialValues={{resetIP: false}}
                      onSubmit={this.onSubmitDeviceReset}
                    >
                      {this.deviceResetFormRender}
                    </Formik>
                    <ConfirmModal
                      isShowModal={isShowSelectModal.resetFinished}
                      modalTitle="System Reset"
                      modalBody="Device has reset, please log back in"
                      onHide={this.hideModal('resetFinished')}
                      onConfirm={() => {
                        location.href = '/';
                      }}/>
                    <div className="form-group">
                      <label>{_('Export System Settings')}</label>
                      <div>
                        <button className="btn btn-outline-primary rounded-pill px-5" type="button" onClick={this.onClickExportDeviceSettings}>{_('Export')}</button>
                      </div>
                    </div>
                    {this.importDeviceSettingsFormRender()}
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
