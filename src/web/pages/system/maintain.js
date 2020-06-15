const download = require('downloadjs');
const React = require('react');
const progress = require('nprogress');
const {Link} = require('capybara-router');
const {Formik, Form, Field} = require('formik');
const Base = require('../shared/base');
const _ = require('../../../languages');
const api = require('../../../core/apis/web-api');
const CustomNotifyModal = require('../../../core/components/custom-notify-modal');
const CustomTooltip = require('../../../core/components/tooltip');

module.exports = class Maintain extends Base {
  constructor(props) {
    super(props);
    this.state.file = null;
    this.state.isShowApiProcessModal = false;
    this.state.apiProcessModalTitle = _('Device processing');
    this.state.isShowFinishModal = false;
    this.state.finishModalTitle = _('Process finished');
    this.state.finishModalBody = '';
    this.state.isShowSelectModal = {
      reboot: false,
      reset: false
    };
  }

  hideApiProcessModal = () => {
    this.setState({isShowApiProcessModal: false});
  };

  hideFinishModal = () => {
    this.setState({isShowFinishModal: false});
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
          this.setState({apiProcessModalTitle: _('Device Rebooting')});
          // Check the server was start up, if success then startup was failed and retry.
          const test = () => {
            api.ping('app')
              .then(() => {
                progress.done();
                this.hideApiProcessModal();
                this.setState({
                  isShowFinishModal: true,
                  finishModalTitle: _('System Reboot'),
                  finishModalBody: _('Device has rebooted. Please log in again.')
                });
              })
              .catch(() => {
                setTimeout(test, 1000);
              });
          };

          test();
        })
        .finally(() => {
          progress.done();
          this.hideApiProcessModal();
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
      apiProcessModalTitle: _('Device Resetting')
    }),
    () => {
      api.system.deviceReset(resetIP)
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
              this.setState({apiProcessModalTitle: _('Device Rebooting')});
              // Check the server was start up, if success then startup was failed and retry.
              const test = () => {
                api.ping('app')
                  .then(() => {
                    progress.done();
                    this.hideApiProcessModal();
                    this.setState({
                      isShowFinishModal: true,
                      finishModalTitle: _('System Reset'),
                      finishModalBody: _('Device has reset. Please log in again.')
                    });
                  })
                  .catch(() => {
                    setTimeout(test, 1000);
                  });
              };

              test();
            })
            .finally(() => {
              progress.done();
              this.hideApiProcessModal();
            });
        })
        .finally(() => {
          progress.done();
          this.hideApiProcessModal();
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
      apiProcessModalTitle: _('Importing device settings')
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
              this.setState({apiProcessModalTitle: _('Device Rebooting')});
              // Check the server was start up, if success then startup was failed and retry.
              const test = () => {
                api.ping('app')
                  .then(() => {
                    progress.done();
                    this.hideApiProcessModal();
                    this.setState({
                      isShowFinishModal: true,
                      finishModalTitle: _('Import System Settings'),
                      finishModalBody: _('Device settings has imported. Please log in again.')
                    });
                  })
                  .catch(() => {
                    setTimeout(test, 1000);
                  });
              };

              test();
            })
            .finally(() => {
              progress.done();
              this.hideApiProcessModal();
            });
        })
        .finally(() => {
          progress.done();
          this.hideApiProcessModal();
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
              {_('Restore All Settings')}
            </label>
          </div>
          <CustomNotifyModal
            isShowModal={this.state.isShowSelectModal.reset}
            modalTitle={_('Restore to Default Setting')}
            modalBody={_('Are you sure you want to reset the system?')}
            isConfirmDisable={this.state.$isApiProcessing}
            onHide={this.hideModal('reset')}
            onConfirm={() => {
              this.onSubmitDeviceReset(values);
            }}/>
          <div>
            <button
              className="btn btn-outline-primary rounded-pill px-5"
              type="button"
              onClick={this.showModal('reset')}
            >
              {_('Reset')}
            </button>
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
          <CustomTooltip show={!file} title={_('Please Select a File First')}>
            <span>
              <button
                disabled={$isApiProcessing || !file}
                className="btn btn-outline-primary rounded-pill px-5"
                type="button"
                style={file ? {} : {pointerEvents: 'none'}}
                onClick={this.onSubmitImportDeviceSettings}
              >
                {_('Import')}
              </button>
            </span>
          </CustomTooltip>
        </div>
      </div>
    );
  };

  render() {
    const {
      $isApiProcessing,
      isShowSelectModal,
      isShowApiProcessModal,
      apiProcessModalTitle,
      isShowFinishModal,
      finishModalTitle,
      finishModalBody
    } = this.state;
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

              <CustomNotifyModal
                modalType="process"
                isShowModal={isShowApiProcessModal}
                modalTitle={apiProcessModalTitle}
                onHide={this.hideApiProcessModal}/>
              <CustomNotifyModal
                modalType="info"
                isShowModal={isShowFinishModal}
                modalTitle={finishModalTitle}
                modalBody={finishModalBody}
                onHide={this.hideFinishModal}
                onConfirm={() => {
                  location.href = '/';
                }}/>

              <div className="col-center">
                <div className="card shadow">
                  <div className="card-header">{_('Device Maintenace')}</div>
                  <div className="card-body">
                    <div className="form-group">
                      <label>{_('System Reboot')}</label>
                      <div>
                        <button
                          className="btn btn-outline-primary rounded-pill px-5"
                          type="button"
                          onClick={this.showModal('reboot')}
                        >
                          {_('Reboot')}
                        </button>
                      </div>
                    </div>
                    <CustomNotifyModal
                      isShowModal={isShowSelectModal.reboot}
                      modalTitle={_('System Reboot')}
                      modalBody={_('Are you sure you want to reboot the system?')}
                      isConfirmDisable={$isApiProcessing}
                      onHide={this.hideModal('reboot')}
                      onConfirm={this.onSubmitDeviceReboot}/>
                    <Formik
                      initialValues={{resetIP: false}}
                      onSubmit={this.onSubmitDeviceReset}
                    >
                      {this.deviceResetFormRender}
                    </Formik>
                    <div className="form-group">
                      <label>{_('Export System Settings')}</label>
                      <div>
                        <button
                          className="btn btn-outline-primary rounded-pill px-5"
                          type="button"
                          onClick={this.onClickExportDeviceSettings}
                        >
                          {_('Export')}
                        </button>
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
