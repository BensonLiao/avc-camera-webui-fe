import React, {useState} from 'react';
import {getRouter} from '@benson.liao/capybara-router';
import progress from 'nprogress';
import i18n from '../../../i18n';
import api from '../../../core/apis/web-api';
import {withApiWrapper} from '../../../core/apis';
import download from 'downloadjs';
import CustomNotifyModal from '../../../core/components/custom-notify-modal';
import StageProgress from '../../../core/components/stage-progress';
import BreadCrumb from '../../../core/components/fields/breadcrumb';

const Log = () => {
  const [isShowConfirmModal, setIsShowConfirmModal] = useState(false);
  const [isShowProgressModal, setIsShowProgressModal] = useState(false);
  const [progressPercentage, setProgressPercentage] = useState(0);

  const onClickClearLog = event => {
    event.preventDefault();
    progress.start();
    api.system.clearLog()
      .then(getRouter().reload)
      .finally(progress.done);
  };

  const onClickDownloadLog = event => {
    event.preventDefault();
    progress.start();
    setIsShowProgressModal(true);
    setProgressPercentage(0);
    withApiWrapper()({
      method: 'get',
      url: '/api/system/systeminfo/log.zip',
      responseType: 'blob',
      onDownloadProgress: progressEvent => {
        // Do whatever you want with the native progress event
        setProgressPercentage(Math.round((progressEvent.loaded / progressEvent.total) * 100));
      }
    })
      .then(response => {
        download(response.data, 'log');
      })
      .finally(() => {
        progress.done();
        setIsShowProgressModal(false);
      });
  };

  return (
    <div className="main-content left-menu-active">
      <div className="section-media">
        <div className="container-fluid">
          <div className="row">
            <BreadCrumb
              className="px-0"
              path={[i18n.t('navigation.sidebar.system'), i18n.t('navigation.sidebar.status'), i18n.t('navigation.sidebar.systemLog')]}
              routes={['/system/datetime', '/system/log']}
            />
            <div className="col-center">
              <div className="card shadow">
                <div className="card-header">{i18n.t('system.systemLog.title')}</div>
                <div className="card-body">
                  <div className="form-group">
                    <label className="mb-0 my-3">{i18n.t('system.systemLog.systemLogFile')}</label>
                    <div>
                      <button
                        className="btn btn-outline-primary rounded-pill px-5"
                        type="button"
                        onClick={() => setIsShowConfirmModal(true)}
                      >{i18n.t('system.systemLog.deleteLogs')}
                      </button>
                      <CustomNotifyModal
                        modalType="default"
                        isShowModal={isShowConfirmModal}
                        modalTitle={i18n.t('system.systemLog.modal.confirmDeleteTitle')}
                        modalBody={i18n.t('system.systemLog.modal.confirmDeleteBody')}
                        onHide={() => setIsShowConfirmModal(false)}
                        onConfirm={onClickClearLog}
                      />
                      <button
                        className="btn btn-outline-primary rounded-pill px-5 ml-3"
                        type="button"
                        onClick={onClickDownloadLog}
                      >{i18n.t('system.systemLog.download')}
                      </button>
                      <CustomNotifyModal
                        modalType="process"
                        backdrop="static"
                        isShowModal={isShowProgressModal}
                        modalTitle={i18n.t('system.systemLog.modal.apiProcessModalTitle')}
                        modalBody={[
                          <StageProgress
                            key="stage 1"
                            title={i18n.t('system.systemLog.modal.downloadingBody')}
                            progressStatus="start"
                            progressPercentage={progressPercentage}
                          />
                        ]}
                        onHide={() => setIsShowProgressModal(false)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Log;

