import React, {useState} from 'react';
import {Formik, Form} from 'formik';
import progress from 'nprogress';
import i18n from '../../../i18n';
import api from '../../../core/apis/web-api';
import utils from '../../../core/utils';
import CustomNotifyModal from '../../../core/components/custom-notify-modal';
import CustomTooltip from '../../../core/components/tooltip';
import StageProgress from '../../../core/components/stage-progress';
import constants from '../../../core/constants';
import BreadCrumb from '../../../core/components/fields/breadcrumb';
import withGlobalStatus from '../../withGlobalStatus';
import {useContextState} from '../../stateProvider';
const isRunTest = false; // Set as `true` to run test on submit
const isMockUpgradeError = false; // Set as `true` to mock upgrade firmware error, only works if `isRunTest` is `true`

const Upgrade = () => {
  const {isApiProcessing} = useContextState();
  const [file, setFile] = useState(null);
  const [isShowApiProcessModal, setIsShowApiProcessModal] = useState(false);
  const [apiProcessModalTitle, setApiProcessModalTitle] = useState(i18n.t('Uploading Software'));
  const [apiProcessModalBody, setApiProcessModalBody] = useState(i18n.t('※ Please do not close your browser during the upgrade.'));
  const [progressPercentage, setProgressPercentage] = useState({
    uploadFirmware: 0,
    upgradeFirmware: 0
  });
  const [progressStatus, setProgressStatus] = useState({
    uploadFirmware: 'initial',
    upgradeFirmware: 'initial',
    deviceShutdown: 'initial',
    deviceRestart: 'initial'
  });

  const updateProgress = (stage, progress) => {
    setProgressPercentage(prevState => ({
      ...prevState,
      [stage]: progress
    }));
  };

  const updateProgressStatus = (stage, progressStatus) => {
    setProgressStatus(prevState => ({
      ...prevState,
      [stage]: progressStatus
    }));
  };

  const onChangeFile = event => setFile(event.target.files[0]);

  const onSubmitForm = () => {
    progress.start();
    setApiProcessModalTitle(i18n.t('Uploading Software'));
    setIsShowApiProcessModal(true);
    updateProgressStatus('uploadFirmware', 'start');
    api.system.uploadFirmware(file, updateProgress)
      .then(response => new Promise(resolve => {
        updateProgressStatus('uploadFirmware', 'done');
        updateProgressStatus('upgradeFirmware', 'start');
        setApiProcessModalTitle(i18n.t('Installing Software'));
        const upgrade = init => {
          api.system.upgradeFirmware(init ? response.data.filename : null)
            .then(response => {
              if (response.data.updateStatus === 2) {
                updateProgress('upgradeFirmware', 100);
                updateProgressStatus('upgradeFirmware', 'done');
                updateProgressStatus('deviceShutdown', 'start');
                // Keep modal and update the title and body.
                setApiProcessModalTitle(i18n.t('Shutting Down'));
                utils.pingToCheckShutdown(resolve, 1000);
              } else {
                updateProgress('upgradeFirmware', response.data.updateProgress);
                setTimeout(() => {
                  upgrade(false);
                }, 2000);
              }
            })
            .catch(() => {
              progress.done();
              updateProgressStatus('upgradeFirmware', 'fail');
            });
        };

        upgrade(true);
      }))
      .then(() => {
        // Keep modal and update the title and body.
        updateProgressStatus('deviceShutdown', 'done');
        updateProgressStatus('deviceRestart', 'start');
        setApiProcessModalTitle(i18n.t('Restarting'));
        // Check the server was startup, if success then startup was failed and retry.
        const test = () => {
          api.ping('app')
            .then(response => {
              console.log('ping app response(userinitiated)', response);
              updateProgressStatus('deviceRestart', 'done');
              setApiProcessModalTitle(i18n.t('Software Upgrade Success'));
              let countdown = constants.REDIRECT_COUNTDOWN;
              const countdownID = setInterval(() => {
                setApiProcessModalBody(i18n.t('Redirect to the login page in {{0}} seconds', {0: --countdown}));
              }, 1000);
              setTimeout(() => {
                clearInterval(countdownID);
                location.href = '/login';
              }, constants.REDIRECT_COUNTDOWN * 1000);
            })
            .catch(() => {
              setTimeout(test, 1000);
            });
        };

        test();
      })
      .catch(() => {
        progress.done();
        updateProgressStatus('uploadFirmware', 'fail');
      });
  };

  // Test Script for FOTA process
  const testScript = () => {
    let count = 0;
    new Promise(resolve => {
      setApiProcessModalTitle(i18n.t('Uploading Software'));
      setIsShowApiProcessModal(true);
      updateProgressStatus('uploadFirmware', 'start');
      let interval = setInterval(() => {
        updateProgress('uploadFirmware', count);
        if (++count === 101) {
          clearInterval(interval);
          updateProgressStatus('uploadFirmware', 'done');
          updateProgressStatus('upgradeFirmware', 'start');
          resolve();
        }
      }, 50);
    })
      .then(() => new Promise((resolve, reject) => {
        count = 0;
        setApiProcessModalTitle(i18n.t('Installing Software'));
        let interval2 = setInterval(() => {
          updateProgress('upgradeFirmware', count);
          // Progress fail test
          if (isMockUpgradeError && count === 55) {
            clearInterval(interval2);
            reject();
          }

          if (++count === 101) {
            clearInterval(interval2);
            updateProgressStatus('upgradeFirmware', 'done');
            updateProgressStatus('deviceShutdown', 'start');
            resolve();
          }
        }, 100);
      }))
      .catch(() => {
        updateProgressStatus('upgradeFirmware', 'fail');
        require('../../../core//notify').showErrorNotification({message: 'upgrade firmware fail'});
        return new Promise(() => {});
      })
      .then(() => new Promise(resolve => {
        setApiProcessModalTitle(i18n.t('Shutting Down'));
        setTimeout(() => {
          updateProgressStatus('deviceRestart', 'start');
          resolve();
        }, 5 * 1000);
      }))
      .then(() => new Promise(resolve => {
        updateProgressStatus('deviceShutdown', 'done');
        setApiProcessModalTitle(i18n.t('Restarting'));
        setTimeout(() => {
          updateProgressStatus('deviceRestart', 'done');
          resolve();
        }, 10 * 1000);
      }))
      .then(() => {
        setApiProcessModalTitle(i18n.t('Software Upgrade Success'));
        let countdown = constants.REDIRECT_COUNTDOWN;
        const countdownID = setInterval(() => {
          setApiProcessModalBody(i18n.t('Redirect to the login page in {{0}} seconds', {0: --countdown}));
        }, 1000);
        setTimeout(() => {
          clearInterval(countdownID);
          location.href = '/login';
        }, constants.REDIRECT_COUNTDOWN * 1000);
      });
  };

  const isLoading = Object.values(progressStatus).some(status => status !== 'done');
  const stageModalBackdrop = Object.values(progressStatus).some(status => status === 'fail') || 'static';

  return (
    <div className="main-content left-menu-active">
      <div className="section-media">
        <div className="container-fluid">
          <div className="row">
            <BreadCrumb
              className="px-0"
              path={[i18n.t('System'), i18n.t('Administration'), i18n.t('Software Upgrade')]}
              routes={['/system/datetime', '/system/datetime']}
            />
            <CustomNotifyModal
              modalType="process"
              loading={isLoading}
              backdrop={stageModalBackdrop}
              isShowModal={isShowApiProcessModal}
              modalTitle={apiProcessModalTitle}
              modalBody={[
                <div key="info text" style={{marginBottom: '32px'}}>
                  {apiProcessModalBody}
                </div>,
                <StageProgress
                  key="stage 1"
                  stage={i18n.t('Stage 01')}
                  title={i18n.t('Upload Software')}
                  progressStatus={progressStatus.uploadFirmware}
                  progressPercentage={progressPercentage.uploadFirmware}
                />,
                <StageProgress
                  key="stage 2"
                  stage={i18n.t('Stage 02')}
                  title={i18n.t('Install Software')}
                  progressStatus={progressStatus.upgradeFirmware}
                  progressPercentage={progressPercentage.upgradeFirmware}
                />,
                <StageProgress
                  key="stage 3"
                  stage={i18n.t('Stage 03')}
                  title={i18n.t('Shut Down')}
                  progressStatus={progressStatus.deviceShutdown}
                />,
                <StageProgress
                  key="stage 4"
                  stage={i18n.t('Stage 04')}
                  title={i18n.t('Restart')}
                  progressStatus={progressStatus.deviceRestart}
                />
              ]}
              onHide={() => setIsShowApiProcessModal(false)}
            />

            <div className="col-center">
              <div className="card shadow">
                <div className="card-header">{i18n.t('Software Upgrade')}</div>
                <Formik initialValues={{}} onSubmit={isRunTest ? testScript : onSubmitForm}>
                  <Form className="card-body">
                    <div className="form-group">
                      <label className="mb-0">{i18n.t('Import File')}</label>
                      <small className="form-text text-muted my-2">
                        {i18n.t('Only ZIP file format is supported')}
                      </small>
                      <div>
                        <label className="btn btn-outline-primary rounded-pill font-weight-bold px-5">
                          <input
                            disabled={isShowApiProcessModal || isApiProcessing}
                            type="file"
                            className="d-none"
                            accept="application/zip"
                            onChange={onChangeFile}
                          />{i18n.t('Select File')}
                        </label>
                        {
                          file ?
                            <span className="text-size-14 text-muted ml-3">{i18n.t(file.name)}</span> :
                            <span className="text-size-14 text-muted ml-3">{i18n.t('No file selected.')}</span>
                        }
                      </div>
                    </div>
                    <CustomTooltip show={!file} title={i18n.t('Please select a file first.')}>
                      <div>
                        <button
                          disabled={(isShowApiProcessModal || isApiProcessing || !file) && !isRunTest}
                          className="btn btn-primary btn-block rounded-pill"
                          type="submit"
                          style={file || isRunTest ? {} : {pointerEvents: 'none'}}
                        >
                          {i18n.t(isRunTest ? 'Run Test' : 'Software Upgrade')}
                        </button>
                      </div>
                    </CustomTooltip>
                  </Form>
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Upgrade.propTypes = {};

export default withGlobalStatus(Upgrade);
