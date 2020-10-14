const React = require('react');
const {Formik, Form} = require('formik');
const progress = require('nprogress');
const Base = require('../shared/base');
const i18n = require('../../i18n').default;
const api = require('../../../core/apis/web-api');
const utils = require('../../../core/utils');
const CustomNotifyModal = require('../../../core/components/custom-notify-modal');
const CustomTooltip = require('../../../core/components/tooltip');
const StageProgress = require('../../../core/components/stage-progress');
const constants = require('../../../core/constants');
const BreadCrumb = require('../../../core/components/fields/breadcrumb').default;
const isRunTest = false; // Set as `true` to run test on submit
const isMockUpgradeError = false; // Set as `true` to mock upgrade firmware error, only works if `isRunTest` is `true`

module.exports = class Upgrade extends Base {
  constructor(props) {
    super(props);
    this.state.file = null;
    this.state.isShowApiProcessModal = false;
    this.state.apiProcessModalTitle = i18n.t('Uploading Firmware');
    this.state.apiProcessModalBody = i18n.t('※ Please do not close browser or tab during upgrade');
    this.state.progressStatus = {
      uploadFirmware: 'initial',
      upgradeFirmware: 'initial',
      deviceShutdown: 'initial',
      deviceRestart: 'initial'
    };
    this.state.progressPercentage = {
      uploadFirmware: 0,
      upgradeFirmware: 0
    };
  }

  // Test Script for FOTA process
  testScript = () => {
    let count = 0;
    new Promise(resolve => {
      this.setState({
        isShowApiProcessModal: true,
        apiProcessModalTitle: i18n.t('Uploading Firmware'),
        progressStatus: {
          uploadFirmware: 'start',
          upgradeFirmware: 'initial',
          deviceShutdown: 'initial',
          deviceRestart: 'initial'
        }
      }, () => {
        let interval = setInterval(() => {
          this.updateProgress('uploadFirmware', count);
          if (++count === 101) {
            clearInterval(interval);
            this.updateProgressStatus('uploadFirmware', 'done');
            this.updateProgressStatus('upgradeFirmware', 'start');
            resolve();
          }
        }, 50);
      });
    })
      .then(() => new Promise((resolve, reject) => {
        count = 0;
        this.setState({apiProcessModalTitle: i18n.t('Installing Firmware')},
          () => {
            let interval2 = setInterval(() => {
              this.updateProgress('upgradeFirmware', count);
              // Progress fail test
              if (isMockUpgradeError && count === 55) {
                clearInterval(interval2);
                reject();
              }

              if (++count === 101) {
                clearInterval(interval2);
                this.updateProgressStatus('upgradeFirmware', 'done');
                this.updateProgressStatus('deviceShutdown', 'start');
                resolve();
              }
            }, 100);
          }
        );
      }))
      .catch(() => {
        this.updateProgressStatus('upgradeFirmware', 'fail');
        require('../../../core//notify').showErrorNotification({message: 'upgrade firmware fail'});
        return new Promise(() => {});
      })
      .then(() => new Promise(resolve => {
        this.setState({apiProcessModalTitle: i18n.t('Device Shutting Down')},
          () => {
            setTimeout(() => {
              this.updateProgressStatus('deviceRestart', 'start');
              resolve();
            }, 5 * 1000);
          }
        );
      }))
      .then(() => new Promise(resolve => {
        this.updateProgressStatus('deviceShutdown', 'done');
        this.setState({apiProcessModalTitle: i18n.t('Device Restarting')},
          () => {
            setTimeout(() => {
              this.updateProgressStatus('deviceRestart', 'done');
              resolve();
            }, 10 * 1000);
          }
        );
      }))
      .then(() => {
        this.setState({apiProcessModalTitle: i18n.t('Firmware Upgrade Success')},
          () => {
            let countdown = constants.REDIRECT_COUNTDOWN;
            this.countdownID = setInterval(() => {
              this.setState({apiProcessModalBody: i18n.t('Redirect to login page in {{0}} seconds', {0: --countdown})});
            }, 1000);
            this.countdownTimerID = setTimeout(() => {
              clearInterval(this.countdownID);
              location.href = '/login';
            }, constants.REDIRECT_COUNTDOWN * 1000);
          }
        );
      });
  }

  updateProgress = (stage, progress) => {
    this.setState(prevState => ({
      progressPercentage: {
        ...prevState.progressPercentage,
        [stage]: progress
      }
    }));
  };

  updateProgressStatus = (stage, progressStatus) => {
    this.setState(prevState => ({
      progressStatus: {
        ...prevState.progressStatus,
        [stage]: progressStatus
      }
    }));
  };

  hideApiProcessModal = () => {
    this.setState({isShowApiProcessModal: false});
  };

  onChangeFile = event => {
    this.setState({file: event.target.files[0]});
  };

  onSubmitForm = () => {
    const {file} = this.state;
    progress.start();
    this.setState({
      isShowApiProcessModal: true,
      progressStatus: {
        uploadFirmware: 'start',
        upgradeFirmware: 'initial',
        deviceShutdown: 'initial',
        deviceRestart: 'initial'
      }
    },
    () => {
      api.system.uploadFirmware(file, this.updateProgress)
        .then(response => new Promise(resolve => {
          this.updateProgressStatus('uploadFirmware', 'done');
          this.updateProgressStatus('upgradeFirmware', 'start');
          this.setState({apiProcessModalTitle: i18n.t('Installing Firmware')});
          const upgrade = init => {
            api.system.upgradeFirmware(init ? response.data.filename : null)
              .then(response => {
                if (response.data.updateStatus === 2) {
                  this.updateProgress('upgradeFirmware', 100);
                  this.updateProgressStatus('upgradeFirmware', 'done');
                  this.updateProgressStatus('deviceShutdown', 'start');
                  // Keep modal and update the title and body.
                  this.setState({apiProcessModalTitle: i18n.t('Device Shutting Down')});
                  utils.pingToCheckShutdown(resolve, 1000);
                } else {
                  this.updateProgress('upgradeFirmware', response.data.updateProgress);
                  setTimeout(() => {
                    upgrade(false);
                  }, 2000);
                }
              })
              .catch(() => {
                progress.done();
                this.updateProgressStatus('upgradeFirmware', 'fail');
              });
          };

          upgrade(true);
        }))
        .then(() => {
          // Keep modal and update the title and body.
          this.updateProgressStatus('deviceShutdown', 'done');
          this.updateProgressStatus('deviceRestart', 'start');
          this.setState({apiProcessModalTitle: i18n.t('Device Restarting')});
          // Check the server was startup, if success then startup was failed and retry.
          const test = () => {
            api.ping('app')
              .then(response => {
                console.log('ping app response(userinitiated)', response);
                this.updateProgressStatus('deviceRestart', 'done');
                this.setState({apiProcessModalTitle: i18n.t('Firmware Upgrade Success')},
                  () => {
                    let countdown = constants.REDIRECT_COUNTDOWN;
                    this.countdownID = setInterval(() => {
                      this.setState({apiProcessModalBody: i18n.t('Redirect to login page in {{0}} seconds', {0: --countdown})});
                    }, 1000);
                    this.countdownTimerID = setTimeout(() => {
                      clearInterval(this.countdownID);
                      location.href = '/login';
                    }, constants.REDIRECT_COUNTDOWN * 1000);
                  }
                );
              })
              .catch(() => {
                setTimeout(test, 1000);
              });
          };

          test();
        })
        .catch(() => {
          progress.done();
          this.updateProgressStatus('uploadFirmware', 'fail');
        });
    });
  };

  formRender = () => {
    const {$isApiProcessing, file, isShowApiProcessModal} = this.state;

    return (
      <Form className="card-body">
        <div className="form-group">
          <label className="mb-0">{i18n.t('Import File')}</label>
          <small className="form-text text-muted my-2">
            {i18n.t('Only .Zip File Supported')}
          </small>
          <div>
            <label className="btn btn-outline-primary rounded-pill font-weight-bold px-5">
              <input
                disabled={isShowApiProcessModal || $isApiProcessing}
                type="file"
                className="d-none"
                accept="application/zip"
                onChange={this.onChangeFile}
              />{i18n.t('Select File')}
            </label>
            {
              file ?
                <span className="text-size-14 text-muted ml-3">{i18n.t(file.name)}</span> :
                <span className="text-size-14 text-muted ml-3">{i18n.t('No Files Selected')}</span>
            }
          </div>
        </div>
        <CustomTooltip show={!file} title={i18n.t('Please Select a File First')}>
          <div>
            <button
              disabled={(isShowApiProcessModal || $isApiProcessing || !file) && !isRunTest}
              className="btn btn-primary btn-block rounded-pill"
              type="submit"
              style={file || isRunTest ? {} : {pointerEvents: 'none'}}
            >
              {i18n.t(isRunTest ? 'Run Test' : 'Firmware Upgrade')}
            </button>
          </div>
        </CustomTooltip>
      </Form>
    );
  };

  render() {
    const {progressStatus, progressPercentage} = this.state;
    const isLoading = Object.values(progressStatus).some(status => status !== 'done');
    const stageModalBackdrop = Object.values(progressStatus).some(status => status === 'fail') || 'static';
    return (
      <div className="main-content left-menu-active">
        <div className="section-media">
          <div className="container-fluid">
            <div className="row">
              <BreadCrumb
                className="px-0"
                path={[i18n.t('System'), i18n.t('Settings'), i18n.t('Firmware Upgrade')]}
                routes={['/system/datetime', '/system/datetime']}
              />
              <CustomNotifyModal
                modalType="process"
                loading={isLoading}
                backdrop={stageModalBackdrop}
                isShowModal={this.state.isShowApiProcessModal}
                modalTitle={this.state.apiProcessModalTitle}
                modalBody={[
                  <div key="info text" style={{marginBottom: '32px'}}>
                    {this.state.apiProcessModalBody}
                  </div>,
                  <StageProgress
                    key="stage 1"
                    stage={i18n.t('Stage 01')}
                    title={i18n.t('Upload Firmware')}
                    progressStatus={progressStatus.uploadFirmware}
                    progressPercentage={progressPercentage.uploadFirmware}
                  />,
                  <StageProgress
                    key="stage 2"
                    stage={i18n.t('Stage 02')}
                    title={i18n.t('Install Firmware')}
                    progressStatus={progressStatus.upgradeFirmware}
                    progressPercentage={progressPercentage.upgradeFirmware}
                  />,
                  <StageProgress
                    key="stage 3"
                    stage={i18n.t('Stage 03')}
                    title={i18n.t('Shutdown Device')}
                    progressStatus={progressStatus.deviceShutdown}
                  />,
                  <StageProgress
                    key="stage 4"
                    stage={i18n.t('Stage 04')}
                    title={i18n.t('Restart Device')}
                    progressStatus={progressStatus.deviceRestart}
                  />
                ]}
                onHide={this.hideApiProcessModal}
              />

              <div className="col-center">
                <div className="card shadow">
                  <div className="card-header">{i18n.t('Firmware Upgrade')}</div>
                  <Formik initialValues={{}} onSubmit={isRunTest ? this.testScript : this.onSubmitForm}>
                    {this.formRender}
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
