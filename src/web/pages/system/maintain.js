import progress from 'nprogress';
import React, {useState} from 'react';
import api from '../../../core/apis/web-api';
import BreadCrumb from '../../../core/components/fields/breadcrumb';
import CustomNotifyModal from '../../../core/components/custom-notify-modal';
import i18n from '../../../i18n';
import {useContextState} from '../../stateProvider';
import utils from '../../../core/utils';
import withGlobalStatus from '../../withGlobalStatus';
import MaintainImportExport from './maintain-import-export';
import MaintainReset from './maintain-reset';

const Maintain = () => {
  const {isApiProcessing} = useContextState();

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

  const [onConfirm, setOnConfirm] = useState(() => () => {
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

  const showConfirmModal = selectedModal => event => {
    event.preventDefault();
    setIsShowSelectModal(prevState => ({
      ...prevState,
      [selectedModal]: true
    }));
  };

  const hideConfirmModal = selectedModal => _ => {
    setIsShowSelectModal(prevState => ({
      ...prevState,
      [selectedModal]: false
    }));
  };

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
                  <MaintainReset
                    showConfirmModal={showConfirmModal}
                    hideConfirmModal={hideConfirmModal}
                    setOnConfirm={setOnConfirm}
                    hideFinishModal={hideFinishModal}
                    setFinishModal={setFinishModal}
                    setApiProcessModal={setApiProcessModal}
                    hideApiProcessModal={hideApiProcessModal}
                    isShowSelectModal={isShowSelectModal}
                  />
                  <MaintainImportExport
                    setApiProcessModal={setApiProcessModal}
                    hideApiProcessModal={hideApiProcessModal}
                    setFinishModal={setFinishModal}
                  />
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
