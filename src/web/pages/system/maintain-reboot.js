import progress from 'nprogress';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import api from '../../../core/apis/web-api';
import CustomNotifyModal from '../../../core/components/custom-notify-modal';
import i18n from '../../../i18n';
import {useContextState} from '../../stateProvider';
import utils from '../../../core/utils';

const MaintainReboot = ({
  setFinishModal,
  setApiProcessModal,
  hideApiProcessModal
}) => {
  const {isApiProcessing} = useContextState();
  const [isShowConfirmModal, setIsShowConfirmModal] = useState(false);

  const onSubmitDeviceReboot = () => {
    progress.start();

    setApiProcessModal({
      isShowApiProcessModal: true,
      apiProcessModalTitle: i18n.t('system.deviceMaintenance.modal.apiProcessModalTitleRebooting')
    });
    setIsShowConfirmModal(false);

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
                finishModalTitle: i18n.t('system.deviceMaintenance.systemReboot'),
                finishModalBody: i18n.t('system.deviceMaintenance.modal.rebootSuccessBody')
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

  return (
    <>
      <div className="form-group">
        <label>{i18n.t('system.deviceMaintenance.systemReboot')}</label>
        <div>
          <button
            className="btn btn-outline-primary rounded-pill px-5"
            type="button"
            onClick={() => setIsShowConfirmModal(true)}
          >
            {i18n.t('system.deviceMaintenance.reboot')}
          </button>
        </div>
      </div>
      <CustomNotifyModal
        isShowModal={isShowConfirmModal}
        modalTitle={i18n.t('system.deviceMaintenance.systemReboot')}
        modalBody={i18n.t('system.deviceMaintenance.modal.confirmRebootBody')}
        isConfirmDisable={isApiProcessing}
        onHide={() => setIsShowConfirmModal(false)}
        onConfirm={onSubmitDeviceReboot}
      />
    </>
  );
};

MaintainReboot.propTypes = {
  setFinishModal: PropTypes.func.isRequired,
  setApiProcessModal: PropTypes.func.isRequired,
  hideApiProcessModal: PropTypes.func.isRequired
};

export default MaintainReboot;
