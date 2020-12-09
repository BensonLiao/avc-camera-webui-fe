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
      apiProcessModalTitle: i18n.t('system.deviceMaintenance.modal.apiProcessModalTitleResetting')
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
                finishModalTitle: i18n.t('system.deviceMaintenance.modal.resetSuccess'),
                finishModalBody: i18n.t('system.deviceMaintenance.modal.resetAllSettingsSuccessBody')
              });
              setOnConfirm(() => hideFinishModal);
            } else {
              // Keep modal and update the title.
              setApiProcessModal(prevState => ({
                ...prevState,
                apiProcessModalTitle: i18n.t('system.deviceMaintenance.modal.apiProcessModalTitleRebooting')
              }));
              // Check the server was start up, if success then startup was failed and retry.
              const test = () => {
                api.ping('app')
                  .then(() => {
                    progress.done();
                    hideApiProcessModal();
                    setFinishModal({
                      isShowFinishModal: true,
                      finishModalTitle: i18n.t('system.deviceMaintenance.modal.resetSuccess'),
                      finishModalBody: i18n.t('system.deviceMaintenance.modal.resetDefaultSettingsSuccessBody')
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
            <label>{i18n.t('system.deviceMaintenance.restoreDefaultSettings')}</label>
            <div className="form-check mb-2">
              <Field type="checkbox" name="resetIP" className="form-check-input" id="input-checkbox-reset-all"/>
              <label className="form-check-label mr-2" htmlFor="input-checkbox-reset-all">
                {i18n.t('system.deviceMaintenance.restoreAllSettings')}
              </label>
              <CustomTooltip title={i18n.t('system.deviceMaintenance.tooltip.restoreAllSettingsHelper')}>
                <i className="fas fa-question-circle helper-text text-primary"/>
              </CustomTooltip>
            </div>
            <CustomNotifyModal
              isShowModal={isShowConfirmModal}
              modalTitle={values.resetIP ? i18n.t('system.deviceMaintenance.restoreAllSettings') : i18n.t('system.deviceMaintenance.restoreDefaultSettings')}
              modalBody={values.resetIP ?
                i18n.t('system.deviceMaintenance.modal.confirmResetAllSettingsBody') :
                i18n.t('system.deviceMaintenance.modal.confirmRestoreDefaultSettingsBody')}
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
                {i18n.t('system.deviceMaintenance.reset')}
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
