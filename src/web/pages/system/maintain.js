import React, {useState} from 'react';
import BreadCrumb from '../../../core/components/fields/breadcrumb';
import CustomNotifyModal from '../../../core/components/custom-notify-modal';
import i18n from '../../../i18n';
import withGlobalStatus from '../../withGlobalStatus';
import MaintainImportExport from './maintain-import-export';
import MaintainReset from './maintain-reset';
import MaintainReboot from './maintain-reboot';

const Maintain = () => {
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

                  <MaintainReboot
                    showConfirmModal={showConfirmModal}
                    hideConfirmModal={hideConfirmModal}
                    setFinishModal={setFinishModal}
                    setApiProcessModal={setApiProcessModal}
                    hideApiProcessModal={hideApiProcessModal}
                    isShowSelectModal={isShowSelectModal}
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
