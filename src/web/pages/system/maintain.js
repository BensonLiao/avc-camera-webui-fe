import download from 'downloadjs';
import React, {useState} from 'react';
import progress from 'nprogress';
import {Formik, Form, Field} from 'formik';
import i18n from '../../../i18n';
import api from '../../../core/apis/web-api';
import utils from '../../../core/utils';
import CustomNotifyModal from '../../../core/components/custom-notify-modal';
import CustomTooltip from '../../../core/components/tooltip';
import BreadCrumb from '../../../core/components/fields/breadcrumb';
import {useContextState} from '../../stateProvider';
import withGlobalStatus from '../../withGlobalStatus';

const Maintain = () => {
  const {isApiProcessing} = useContextState();

  const [file, setFile] = useState(null);

  const [apiProcessModal, setApiProcessModal] = useState({
    isShowApiProcessModal: false,
    apiProcessModalTitle: ''
  });

  const {isShowApiProcessModal, apiProcessModalTitle} = apiProcessModal;

  const [finishModal, setFinishModal] = useState({
    isShowFinishModal: false,
    finishModalTitle: i18n.t('Process finished'),
    finishModalBody: ''
  });

  const {isShowFinishModal, finishModalTitle, finishModalBody} = finishModal;

  const [isShowSelectModal, setIsShowSelectModal] = useState({
    reboot: false,
    reset: false
  });

  const [onConfirm, setOnConfirm] = useState(() => {
    location.href = '/';
  });

  const hideApiProcessModal = () => {
    setApiProcessModal(prevState => ({
      ...prevState,
      isShowApiProcessModal: false
    }));
  };

  const hideFinishModal = () => {
    setFinishModal(prevState => ({
      ...prevState,
      isShowFinishModal: false
    }));
  };

  const showModal = selectedModal => event => {
    event.preventDefault();
    setIsShowSelectModal(prevState => ({
      ...prevState.isShowSelectModal,
      [selectedModal]: true
    }));
  };

  const hideModal = selectedModal => _ => {
    setIsShowSelectModal(prevState => ({
      ...prevState.isShowSelectModal,
      [selectedModal]: false
    }));
  };

  const onChangeFile = event => {
    setFile(event.target.files[0]);
  };

  const onSubmitDeviceReboot = () => {
    progress.start();

    setApiProcessModal({
      isShowApiProcessModal: true,
      apiProcessModalTitle: i18n.t('Rebooting')
    });
    hideModal('reboot');

    api.system.deviceReboot()
      .then(() => new Promise(resolve => {
        utils.pingToCheckShutdown(resolve, 1000);
      }))
      .then(() => {
        // Check the server was start up, if success then startup was failed and retry.
        const test = () => {
          api.ping('app')
            .then(() => {
              progress.done();
              hideApiProcessModal();
              setFinishModal({
                isShowFinishModal: true,
                finishModalTitle: i18n.t('System Reboot'),
                finishModalBody: i18n.t('The device has rebooted. Please log in again.')
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
        hideApiProcessModal();
      });
  };

  const onSubmitDeviceReset = ({resetIP}) => {
    progress.start();
    setApiProcessModal({
      isShowApiProcessModal: true,
      apiProcessModalTitle: i18n.t('Resetting')
    });
    hideModal('reset');

    api.system.deviceReset(resetIP)
      .then(() => {
        new Promise(resolve => {
          utils.pingToCheckShutdown(resolve, 1000);
        })
          .then(() => {
            if (resetIP) {
              progress.done();
              hideApiProcessModal();
              setFinishModal({
                isShowFinishModal: true,
                finishModalTitle: i18n.t('Reset Success'),
                finishModalBody: i18n.t('Please go through the Initial Setup procedure. Refer to the Quick Installation Guide for instructions.')
              });
              setOnConfirm(hideFinishModal);
            } else {
              // Keep modal and update the title.
              setApiProcessModal(prevState => ({
                ...prevState,
                apiProcessModalTitle: i18n.t('Rebooting')
              }));
              // Check the server was start up, if success then startup was failed and retry.
              const test = () => {
                api.ping('app')
                  .then(() => {
                    progress.done();
                    hideApiProcessModal();
                    setFinishModal({
                      isShowFinishModal: true,
                      finishModalTitle: i18n.t('Reset Success'),
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
        hideApiProcessModal();
      });
  };

  const onClickExportDeviceSettings = event => {
    event.preventDefault();
    download('/api/system/device_settings.zip');
  };

  const onSubmitImportDeviceSettings = () => {
    progress.start();
    setApiProcessModal({
      isShowApiProcessModal: true,
      apiProcessModalTitle: i18n.t('Importing Device Settings')
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
              setApiProcessModal(prevState => ({
                ...prevState,
                apiProcessModalTitle: i18n.t('Rebooting')
              }));
              // Check the server was start up, if success then startup was failed and retry.
              const test = () => {
                api.ping('app')
                  .then(() => {
                    progress.done();
                    hideApiProcessModal();
                    setFinishModal({
                      isShowFinishModal: true,
                      finishModalTitle: i18n.t('Import System Settings'),
                      finishModalBody: i18n.t('Device settings have imported. Please log in again.')
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
              hideApiProcessModal();
            });
        })
        .catch(() => {
          progress.done();
          hideApiProcessModal();
        });
    });
  };

  const deviceResetFormRender = ({values}) => {
    return (
      <Form>
        <div className="form-group">
          <label>{i18n.t('Restore to Default Settings')}</label>
          <div className="form-check mb-2">
            <Field type="checkbox" name="resetIP" className="form-check-input" id="input-checkbox-reset-all"/>
            <label className="form-check-label mr-2" htmlFor="input-checkbox-reset-all">
              {i18n.t('Restore All Settings')}
            </label>
            <CustomTooltip title={i18n.t('Check this option to overwrite these settings: Members and Groups, System Accounts, Focus and Zoom of Image settings, RTSP settings, Internet & Network settings, app settings and data on the SD Card.')}>
              <i className="fas fa-question-circle helper-text text-primary"/>
            </CustomTooltip>
          </div>
          <CustomNotifyModal
            isShowModal={isShowSelectModal.reset}
            modalTitle={values.resetIP ? i18n.t('Restore All Settings') : i18n.t('Restore to Default Settings')}
            modalBody={values.resetIP ?
              i18n.t('The system will revert to factory default settings. All data and configurations you have saved will be overwritten.') :
              [`${i18n.t('The system will reset the device. All configurations will be overwritten and settings will revert back to default, except the following')} :`,
                i18n.t('• Members and Groups'),
                i18n.t('• System Accounts'),
                i18n.t('• Focus and Zoom of Image settings'),
                i18n.t('• RTSP settings'),
                i18n.t('• Internet & Network settings'),
                i18n.t('• Data on the SD Card')]}
            isConfirmDisable={isApiProcessing}
            onHide={hideModal('reset')}
            onConfirm={() => {
              onSubmitDeviceReset(values);
            }}
          />
          <div>
            <button
              className="btn btn-outline-primary rounded-pill px-5"
              type="button"
              onClick={showModal('reset')}
            >
              {i18n.t('Reset')}
            </button>
          </div>
        </div>
      </Form>
    );
  };

  const importDeviceSettingsFormRender = () => {
    return (
      <div className="form-group">
        <label className="mb-0">{i18n.t('Import System Settings')}</label>
        <small className="form-text text-muted my-2">{i18n.t('Only ZIP file format is supported')}</small>
        <div>
          <label className="btn btn-outline-primary rounded-pill font-weight-bold px-5">
            <input type="file" className="d-none" accept="application/zip" onChange={onChangeFile}/>
            {i18n.t('Select File')}
          </label>
          {
            file ?
              <span className="text-size-14 text-muted ml-3">{i18n.t(file.name)}</span> :
              <span className="text-size-14 text-muted ml-3">{i18n.t('No file selected.')}</span>
          }
        </div>
        <div>
          <CustomTooltip show={!file} title={i18n.t('Please select a file first.')}>
            <span>
              <button
                disabled={isApiProcessing || !file}
                className="btn btn-outline-primary rounded-pill px-5"
                type="button"
                style={file ? {} : {pointerEvents: 'none'}}
                onClick={onSubmitImportDeviceSettings}
              >
                {i18n.t('Import')}
              </button>
            </span>
          </CustomTooltip>
        </div>
      </div>
    );
  };

  return (
    <div className="main-content left-menu-active">
      <div className="page-system">
        <div className="container-fluid">
          <div className="row">
            <BreadCrumb
              path={[i18n.t('System'), i18n.t('Administration'), i18n.t('Device Maintenance')]}
              routes={['/system/datetime', '/system/datetime']}
            />
            <CustomNotifyModal
              modalType="process"
              backdrop="static"
              isShowModal={isShowApiProcessModal}
              modalTitle={apiProcessModalTitle}
              onHide={hideApiProcessModal}
            />
            <CustomNotifyModal
              modalType="info"
              isShowModal={isShowFinishModal}
              modalTitle={finishModalTitle}
              modalBody={finishModalBody}
              onHide={hideFinishModal}
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
                        onClick={showModal('reboot')}
                      >
                        {i18n.t('Reboot')}
                      </button>
                    </div>
                  </div>
                  <CustomNotifyModal
                    isShowModal={isShowSelectModal.reboot}
                    modalTitle={i18n.t('System Reboot')}
                    modalBody={i18n.t('Are you sure you want to reboot the device?')}
                    isConfirmDisable={isApiProcessing}
                    onHide={hideModal('reboot')}
                    onConfirm={onSubmitDeviceReboot}
                  />
                  <Formik
                    initialValues={{resetIP: false}}
                    onSubmit={onSubmitDeviceReset}
                  >
                    {deviceResetFormRender}
                  </Formik>
                  <div className="form-group">
                    <label>{i18n.t('Export System Settings')}</label>
                    <div>
                      <button
                        className="btn btn-outline-primary rounded-pill px-5"
                        type="button"
                        onClick={onClickExportDeviceSettings}
                      >
                        {i18n.t('Export')}
                      </button>
                    </div>
                  </div>
                  {importDeviceSettingsFormRender()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withGlobalStatus(Maintain);
