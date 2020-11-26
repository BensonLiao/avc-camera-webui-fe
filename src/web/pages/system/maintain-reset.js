import {Formik, Form, Field} from 'formik';
import progress from 'nprogress';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import api from '../../../core/apis/web-api';
import CustomTooltip from '../../../core/components/tooltip';
import CustomNotifyModal from '../../../core/components/custom-notify-modal';
import i18n from '../../../i18n';
import {useContextState} from '../../stateProvider';
import utils from '../../../core/utils';

const MaintainReset = ({
  setOnConfirm,
  hideFinishModal,
  setFinishModal,
  setApiProcessModal,
  hideApiProcessModal
}) => {
  const {isApiProcessing} = useContextState();
  const [isShowConfirmModal, setIsShowConfirmModal] = useState(false);

  const onSubmitDeviceReset = ({resetIP}) => {
    progress.start();
    setApiProcessModal({
      isShowApiProcessModal: true,
      apiProcessModalTitle: i18n.t('Resetting')
    });
    setIsShowConfirmModal(false);

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
              setOnConfirm(() => hideFinishModal);
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
                    setOnConfirm(() => () => {
                      location.href = '/';
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

  return (
    <Formik
      initialValues={{resetIP: false}}
      onSubmit={onSubmitDeviceReset}
    >
      {({values}) => (
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
              isShowModal={isShowConfirmModal}
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
              onHide={() => setIsShowConfirmModal(false)}
              onConfirm={() => {
                onSubmitDeviceReset(values);
              }}
            />
            <div>
              <button
                className="btn btn-outline-primary rounded-pill px-5"
                type="button"
                onClick={() => setIsShowConfirmModal(true)}
              >
                {i18n.t('Reset')}
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

MaintainReset.propTypes = {
  setOnConfirm: PropTypes.func.isRequired,
  hideFinishModal: PropTypes.func.isRequired,
  setFinishModal: PropTypes.func.isRequired,
  setApiProcessModal: PropTypes.func.isRequired,
  hideApiProcessModal: PropTypes.func.isRequired
};

export default MaintainReset;
