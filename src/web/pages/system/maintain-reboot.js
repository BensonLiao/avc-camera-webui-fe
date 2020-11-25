import React from 'react';
import progress from 'nprogress';
import PropTypes from 'prop-types';
import i18n from '../../../i18n';
import {useContextState} from '../../stateProvider';
import api from '../../../core/apis/web-api';
import CustomNotifyModal from '../../../core/components/custom-notify-modal';
import utils from '../../../core/utils';

const MaintainReboot = ({
  showConfirmModal,
  hideConfirmModal,
  setFinishModal,
  setApiProcessModal,
  hideApiProcessModal,
  isShowSelectModal
}) => {
  const {isApiProcessing} = useContextState();

  const onSubmitDeviceReboot = () => {
    progress.start();

    setApiProcessModal({
      isShowApiProcessModal: true,
      apiProcessModalTitle: i18n.t('Rebooting')
    });
    hideConfirmModal('reboot')();

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

  return (
    <>
      <div className="form-group">
        <label>{i18n.t('System Reboot')}</label>
        <div>
          <button
            className="btn btn-outline-primary rounded-pill px-5"
            type="button"
            onClick={showConfirmModal('reboot')}
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
        onHide={hideConfirmModal('reboot')}
        onConfirm={onSubmitDeviceReboot}
      />
    </>
  );
};

MaintainReboot.propTypes = {
  showConfirmModal: PropTypes.func.isRequired,
  hideConfirmModal: PropTypes.func.isRequired,
  setFinishModal: PropTypes.func.isRequired,
  setApiProcessModal: PropTypes.func.isRequired,
  hideApiProcessModal: PropTypes.func.isRequired,
  isShowSelectModal: PropTypes.object.isRequired
};

export default MaintainReboot;
