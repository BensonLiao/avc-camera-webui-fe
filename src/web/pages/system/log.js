import React, {useState} from 'react';
import {getRouter} from '@benson.liao/capybara-router';
import progress from 'nprogress';
import i18n from '../../../i18n';
import api from '../../../core/apis/web-api';
import wrappedApi from '../../../core/apis';
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
    wrappedApi({
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
              path={[i18n.t('System Settings'), i18n.t('Status'), i18n.t('System Log')]}
              routes={['/system/datetime', '/system/log']}
            />
            <div className="col-center">
              <div className="card shadow">
                <div className="card-header">{i18n.t('System Log')}</div>
                <div className="card-body">
                  <div className="form-group">
                    <label className="mb-0 my-3">{i18n.t('System Log File')}</label>
                    <div>
                      <button
                        className="btn btn-outline-primary rounded-pill px-5"
                        type="button"
                        onClick={() => setIsShowConfirmModal(true)}
                      >{i18n.t('Delete logs')}
                      </button>
                      <CustomNotifyModal
                        modalType="default"
                        isShowModal={isShowConfirmModal}
                        modalTitle={i18n.t('Delete System Log File')}
                        modalBody={i18n.t('Are you sure you want to delete system logs?')}
                        onHide={() => setIsShowConfirmModal(false)}
                        onConfirm={onClickClearLog}
                      />
                      <button
                        className="btn btn-outline-primary rounded-pill px-5 ml-3"
                        type="button"
                        onClick={onClickDownloadLog}
                      >{i18n.t('Download')}
                      </button>
                      <CustomNotifyModal
                        modalType="process"
                        backdrop="static"
                        isShowModal={isShowProgressModal}
                        modalTitle={i18n.t('Downloading System Log File')}
                        modalBody={[
                          <StageProgress
                            key="stage 1"
                            title={i18n.t('Download progress')}
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

