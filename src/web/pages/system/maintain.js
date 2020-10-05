const download = require('downloadjs');
const React = require('react');
const progress = require('nprogress');
const {Formik, Form, Field} = require('formik');
const Base = require('../shared/base');
const {default: i18n} = require('../../i18n');
const api = require('../../../core/apis/web-api');
const utils = require('../../../core/utils');
const CustomNotifyModal = require('../../../core/components/custom-notify-modal');
const CustomTooltip = require('../../../core/components/tooltip');
const {default: BreadCrumb} = require('../../../core/components/fields/breadcrumb');

module.exports = class Maintain extends Base {
  constructor(props) {
    super(props);
    this.state.file = null;
    this.state.isShowApiProcessModal = false;
    this.state.apiProcessModalTitle = i18n.t('Device processing');
    this.state.isShowFinishModal = false;
    this.state.finishModalTitle = i18n.t('Process finished');
    this.state.finishModalBody = '';
    this.state.onConfirm = () => {
      location.href = '/';
    };

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
          utils.pingToCheckShutdown(resolve, 1000);
        }))
        .then(() => {
          // Keep modal and update the title.
          this.setState({apiProcessModalTitle: i18n.t('Device Rebooting')});
          // Check the server was start up, if success then startup was failed and retry.
          const test = () => {
            api.ping('app')
              .then(() => {
                progress.done();
                this.hideApiProcessModal();
                this.setState({
                  isShowFinishModal: true,
                  finishModalTitle: i18n.t('System Reboot'),
                  finishModalBody: i18n.t('Device has rebooted. Please log in again.')
                });
              })
              .catch(() => {
                setTimeout(test, 1000);
              });
          };

          test();
        })
        .catch(() => {
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
      apiProcessModalTitle: i18n.t('Device Resetting')
    }),
    () => {
      api.system.deviceReset(resetIP)
        .then(() => {
          new Promise(resolve => {
            utils.pingToCheckShutdown(resolve, 1000);
          })
            .then(() => {
              if (resetIP) {
                progress.done();
                this.hideApiProcessModal();
                this.setState({
                  isShowFinishModal: true,
                  finishModalTitle: i18n.t('Device Resetting to Factory Default'),
                  finishModalBody: i18n.t('Please follow the user manual to access your camera.'),
                  onConfirm: this.hideFinishModal
                });
              } else {
                // Keep modal and update the title.
                this.setState({apiProcessModalTitle: i18n.t('Device Rebooting')});
                // Check the server was start up, if success then startup was failed and retry.
                const test = () => {
                  api.ping('app')
                    .then(() => {
                      progress.done();
                      this.hideApiProcessModal();
                      this.setState({
                        isShowFinishModal: true,
                        finishModalTitle: i18n.t('System Reset'),
                        finishModalBody: i18n.t('Device has reset. Please log in again.')
                      });
                    })
                    .catch(() => {
                      setTimeout(test, 1000);
                    });
                };

                test();
              }
            });
        })
        .catch(() => {
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
      apiProcessModalTitle: i18n.t('Importing device settings')
    },
    () => {
      api.system.importDeviceSettings(file)
        .then(() => {
          api.system.deviceReboot()
            .then(() => new Promise(resolve => {
              // Check the server was shut down, if success then shutdown was failed and retry.
              utils.pingToCheckShutdown(resolve, 1000);
            }))
            .then(() => {
              // Keep modal and update the title.
              this.setState({apiProcessModalTitle: i18n.t('Device Rebooting')});
              // Check the server was start up, if success then startup was failed and retry.
              const test = () => {
                api.ping('app')
                  .then(() => {
                    progress.done();
                    this.hideApiProcessModal();
                    this.setState({
                      isShowFinishModal: true,
                      finishModalTitle: i18n.t('Import System Settings'),
                      finishModalBody: i18n.t('Device settings has imported. Please log in again.')
                    });
                  })
                  .catch(() => {
                    setTimeout(test, 1000);
                  });
              };

              test();
            })
            .catch(() => {
              progress.done();
              this.hideApiProcessModal();
            });
        })
        .catch(() => {
          progress.done();
          this.hideApiProcessModal();
        });
    });
  };

  deviceResetFormRender = ({values}) => {
    return (
      <Form>
        <div className="form-group">
          <label>{i18n.t('Restore to Default Setting')}</label>
          <div className="form-check mb-2">
            <Field type="checkbox" name="resetIP" className="form-check-input" id="input-checkbox-reset-all"/>
            <label className="form-check-label" htmlFor="input-checkbox-reset-all">
              {i18n.t('Restore All Settings')}
            </label>
            <CustomTooltip title={i18n.t('Check or clear this option to overwrite or preserve these settings: Members and Groups, System Accounts, Focus and Zoom settings of Image, RTSP settings, Internet/Network settings, and data on the SD Card.')}>
              <i className="fas fa-question-circle text-primary"/>
            </CustomTooltip>
          </div>
          <CustomNotifyModal
            isShowModal={this.state.isShowSelectModal.reset}
            modalTitle={values.resetIP ? i18n.t('Restore All Settings') : i18n.t('Restore to Default Settings')}
            modalBody={values.resetIP ?
              i18n.t('The system will revert to factory default settings. Any data and configurations you have saved will be overwritten.') :
              [`${i18n.t('The system will reset the device. All configurations will be overwritten and settings will revert back to default, except the following')} :`,
                i18n.t('• Members and Groups'),
                i18n.t('• System Accounts'),
                i18n.t('• Focus and Zoom settings of the Image'),
                i18n.t('• RTSP settings'),
                i18n.t('• Internet/Network settings'),
                i18n.t('• SD Card settings.')]}
            isConfirmDisable={this.state.$isApiProcessing}
            onHide={this.hideModal('reset')}
            onConfirm={() => {
              this.onSubmitDeviceReset(values);
            }}
          />
          <div>
            <button
              className="btn btn-outline-primary rounded-pill px-5"
              type="button"
              onClick={this.showModal('reset')}
            >
              {i18n.t('Reset')}
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
        <label className="mb-0">{i18n.t('Import System Settings')}</label>
        <small className="form-text text-muted my-2">{i18n.t('Only .Zip File Supported')}</small>
        <div>
          <label className="btn btn-outline-primary rounded-pill font-weight-bold px-5">
            <input type="file" className="d-none" accept="application/zip" onChange={this.onChangeFile}/>
            {i18n.t('Select File')}
          </label>
          {
            file ?
              <span className="text-size-14 text-muted ml-3">{i18n.t(file.name)}</span> :
              <span className="text-size-14 text-muted ml-3">{i18n.t('No Files Selected')}</span>
          }
        </div>
        <div>
          <CustomTooltip show={!file} title={i18n.t('Please Select a File First')}>
            <span>
              <button
                disabled={$isApiProcessing || !file}
                className="btn btn-outline-primary rounded-pill px-5"
                type="button"
                style={file ? {} : {pointerEvents: 'none'}}
                onClick={this.onSubmitImportDeviceSettings}
              >
                {i18n.t('Import')}
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
      finishModalBody,
      onConfirm
    } = this.state;
    return (
      <div className="main-content left-menu-active">
        <div className="page-system">
          <div className="container-fluid">
            <div className="row">
              <BreadCrumb
                path={[i18n.t('System'), i18n.t('Settings'), i18n.t('Device Maintenance')]}
                routes={['/system/datetime', '/system/datetime']}
              />
              <CustomNotifyModal
                modalType="process"
                backdrop="static"
                isShowModal={isShowApiProcessModal}
                modalTitle={apiProcessModalTitle}
                onHide={this.hideApiProcessModal}
              />
              <CustomNotifyModal
                modalType="info"
                isShowModal={isShowFinishModal}
                modalTitle={finishModalTitle}
                modalBody={finishModalBody}
                onHide={this.hideFinishModal}
                onConfirm={onConfirm}
              />

              <div className="col-center">
                <div className="card shadow">
                  <div className="card-header">{i18n.t('Device Maintenance')}</div>
                  <div className="card-body">
                    <div className="form-group">
                      <label>{i18n.t('System Reboot')}</label>
                      <div>
                        <button
                          className="btn btn-outline-primary rounded-pill px-5"
                          type="button"
                          onClick={this.showModal('reboot')}
                        >
                          {i18n.t('Reboot')}
                        </button>
                      </div>
                    </div>
                    <CustomNotifyModal
                      isShowModal={isShowSelectModal.reboot}
                      modalTitle={i18n.t('System Reboot')}
                      modalBody={i18n.t('Are you sure you want to reboot the system?')}
                      isConfirmDisable={$isApiProcessing}
                      onHide={this.hideModal('reboot')}
                      onConfirm={this.onSubmitDeviceReboot}
                    />
                    <Formik
                      initialValues={{resetIP: false}}
                      onSubmit={this.onSubmitDeviceReset}
                    >
                      {this.deviceResetFormRender}
                    </Formik>
                    <div className="form-group">
                      <label>{i18n.t('Export System Settings')}</label>
                      <div>
                        <button
                          className="btn btn-outline-primary rounded-pill px-5"
                          type="button"
                          onClick={this.onClickExportDeviceSettings}
                        >
                          {i18n.t('Export')}
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
