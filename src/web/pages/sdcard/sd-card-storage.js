import dayjs from 'dayjs';
import download from 'downloadjs';
import {Formik, Form} from 'formik';
import {getRouter} from '@benson.liao/capybara-router';
import progress from 'nprogress';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import api from '../../../core/apis/web-api';
import CustomNotifyModal from '../../../core/components/custom-notify-modal';
import CustomTooltip from '../../../core/components/tooltip';
import {getPaginatedData} from '../../../core/utils';
import i18n from '../../../i18n';
import {ITEMS_PER_PAGE} from '../../../core/constants';
import Pagination from '../../../core/components/pagination';
import SDCardStorageTable from './sd-card-storage-table';
import SDCardStorageSearchForm from './sd-card-storage-search-form';
import StageProgress from '../../../core/components/stage-progress';
import {STAGE_PROGRESS_STATUS} from '../../../core/constants';
import TableFixTopCaption from '../../../core/components/table-fixtop-caption';
import {tableState} from '../../../core/components/checkbox-table';
import {useConfirm} from '../../../core/components/confirm';
import {useProcessing} from '../../../core/components/processing';
import {withApiWrapper} from '../../../core/apis';
import withGlobalStatus from '../../withGlobalStatus';

/*
 * Image/Snapshot is removed due to hardware limitations.
 * Codes regarding snapshot will remain in case this problem
 * is solved in the future
 */
const FileType = {
  image: 'image',
  video: 'video'
};

const SDCardStorage = ({storage: {files, date, pageType}, rootDirectoryName}) => {
  const confirm = useConfirm();
  const processing = useProcessing();
  const storageFileType = getRouter().currentRoute.name === 'web.sd-card.image' ? FileType.image : FileType.video;
  const isRootDirectory = pageType === 'root';
  const rootPath = pageType === 'image' ? rootDirectoryName[0]?.name : rootDirectoryName[1]?.name;
  const [pageNumber, setPage] = useState(0);
  const [isShowProgressModal, setIsShowProgressModal] = useState(false);
  const [progressPercentage, setProgressPercentage] = useState({
    zipDownloadFiles: 0,
    downloadFiles: 0
  });
  const [progressStatus, setProgressStatus] = useState({
    zipDownloadFiles: STAGE_PROGRESS_STATUS.INIT,
    downloadFiles: STAGE_PROGRESS_STATUS.INIT
  });
  const [folderName, setFolderName] = useState();
  const [currentDate, setCurrentDate] = useState(date);

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

  const generatePaginatedCheckList = files => {
    return getPaginatedData(files.map(file => ({
      ...file,
      isChecked: false
    })), ITEMS_PER_PAGE);
  };

  const getFinalSelectedList = list => typeof list === 'string' ?
    [list] :
    tableState.current;

  const goUpFolder = setFormValues => {
    api.system.getSDCardStorageFiles(storageFileType, '')
      .then(response => {
        setFormValues(generatePaginatedCheckList(response.data));
        setFolderName(undefined);
        setPage(0);
      });
  };

  /**
   * Delete selected file
   * @param {String | null} filePath - File to be deleted
   * @returns {void}
   */
  const handleDelete = (filePath = null) => _ => {
    confirm.open({
      title: i18n.t('sdCard.storage.modal.confirmDeleteTitle'),
      body: i18n.t('sdCard.storage.modal.confirmDeleteBody')
    })
      .then(isConfirm => {
        if (isConfirm) {
          processing.start({title: i18n.t('sdCard.storage.modal.deleteFileApiProcessing')});
          api.system.deleteSDCardStorageFiles(storageFileType, getFinalSelectedList(filePath))
            .then(getRouter().reload)
            .finally(processing.done);
        }
      });
  };

  const downloadFiles = list => {
    progress.start();
    setIsShowProgressModal(true);
    setProgressPercentage({
      zipDownloadFiles: 0,
      downloadFiles: 0
    });
    setProgressStatus({
      zipDownloadFiles: STAGE_PROGRESS_STATUS.INIT,
      downloadFiles: STAGE_PROGRESS_STATUS.INIT
    });
    api.system.downloadSDCardStorageFiles(storageFileType, getFinalSelectedList(list))
      .then(() => new Promise(resolve => {
        updateProgressStatus('zipDownloadFiles', STAGE_PROGRESS_STATUS.START);
        const pingDownloadFilesStatus = () => {
          api.system.getDownloadSDCardStorageFilesStatus()
            .then(response => {
              updateProgress('zipDownloadFiles', response.data.progress);
              if (response.data.progress === 100) {
                updateProgressStatus('zipDownloadFiles', STAGE_PROGRESS_STATUS.DONE);
                updateProgressStatus('downloadFiles', STAGE_PROGRESS_STATUS.START);
                resolve(withApiWrapper()({
                  method: 'get',
                  url: '/api/sdcard-storage/batchDownload',
                  responseType: 'blob',
                  onDownloadProgress: progressEvent => {
                    // Do whatever you want with the native progress event
                    updateProgress('downloadFiles', Math.round((progressEvent.loaded / progressEvent.total) * 100));
                  }
                }));
              } else {
                setTimeout(() => {
                  pingDownloadFilesStatus();
                }, 1000);
              }
            })
            .catch(() => {
              progress.done();
              updateProgressStatus('zipDownloadFiles', STAGE_PROGRESS_STATUS.ERROR);
            });
        };

        pingDownloadFilesStatus();
      }))
      .then(response => {
        updateProgressStatus('downloadFiles', STAGE_PROGRESS_STATUS.DONE);
        download(response.data, 'sdcard_files');
      })
      .catch(() => {
        updateProgressStatus('downloadFiles', STAGE_PROGRESS_STATUS.ERROR);
      })
      .finally(() => api.system.deleteDownloadedSDCardStorageFiles())
      .finally(() => {
        progress.done();
        setIsShowProgressModal(false);
      });
  };

  return (
    <div className="main-content left-menu-active bg-white">
      <div className="section-media p-0">
        <div className="container-fluid">
          <div className="row">
            <Formik
              initialValues={generatePaginatedCheckList(files)}
            >
              {form => {
                const isButtonDisabled = (tableState && tableState.current === null) || tableState.current.length <= 0;
                return (
                  <div className="card-body col-12 px-32px py-0">
                    <div className="d-flex justify-content-between align-items-center mt-4">
                      <SDCardStorageSearchForm
                        generatePaginatedCheckList={generatePaginatedCheckList}
                        initialSearchCondition={{date: currentDate}}
                        setCurrentDate={setCurrentDate}
                        updateSearchResult={values => form.setValues(values)}
                        storageFileType={storageFileType}
                        isRootDirectory={isRootDirectory}
                        setFolderName={setFolderName}
                      />
                      <div className="float-right d-inline-flex">
                        <CustomTooltip placement="top" show={isButtonDisabled} title={i18n.t('sdCard.storage.tooltip.noFile')}>
                          <div className="ml-3">
                            <button
                              className="btn btn-outline-primary rounded-pill"
                              type="button"
                              disabled={isButtonDisabled || isRootDirectory}
                              style={{pointerEvents: isButtonDisabled ? 'none' : 'auto'}}
                              onClick={() => downloadFiles(form.values)}
                            >
                              <i className="fas fa-download mr-2"/>
                              {i18n.t('sdCard.storage.button.download')}
                            </button>
                          </div>
                        </CustomTooltip>
                        <div className="dropdown">
                          <button
                            className="btn no-highlight text-primary shadow-none"
                            type="button"
                            disabled={isRootDirectory}
                            data-toggle="dropdown"
                          >
                            <i className="fas fa-ellipsis-v fa-fw text-primary"/>
                          </button>
                          <div className="dropdown-menu dropdown-menu-right shadow text-primary">
                            <CustomTooltip placement="top" show={isButtonDisabled} title={i18n.t('sdCard.storage.tooltip.noFile')}>
                              <div style={isButtonDisabled ? {cursor: 'not-allowed'} : {}}>
                                <button
                                  className="dropdown-item"
                                  type="button"
                                  disabled={isButtonDisabled}
                                  style={{pointerEvents: isButtonDisabled ? 'none' : 'auto'}}
                                  onClick={handleDelete()}
                                >
                                  {i18n.t('sdCard.storage.button.remove')}
                                </button>
                              </div>
                            </CustomTooltip>
                          </div>
                        </div>

                      </div>
                    </div>
                    <div
                      className="horizontal-border"
                      style={{
                        width: 'calc(100% + 4rem)',
                        marginLeft: '-2rem'
                      }}
                    />
                    {
                      isRootDirectory ? (
                        <TableFixTopCaption isShow hasBorder={false}>
                          <span className="sd-path"><i className="fas fa-sd-card fa-lg mr-3"/>SDCard <span className="mx-2">&gt;</span> Android</span>
                        </TableFixTopCaption>
                      ) : (
                        <TableFixTopCaption isShow>
                          <button
                            type="button"
                            className="btn btn-link p-0"
                            onClick={() => folderName ? goUpFolder(form.setValues) : getRouter().go({name: 'web.sd-card.storage'})}
                          >
                            <i className="fas fa-angle-left fa-lg text-primary"/>
                          </button>
                          {/* eslint-disable react/jsx-child-element-spacing */}
                          <span className="sd-path"><i className="fas fa-sd-card fa-lg mr-3"/>
                            SDCard
                            <span className="mx-2">&gt;</span>
                            Android
                            <span className="mx-2">&gt;</span>
                            {rootPath}
                            {
                              folderName && (
                                <>
                                  <span className="mx-2">&gt;</span>
                                  {folderName}
                                </>
                              )
                            }
                          </span>
                        </TableFixTopCaption>
                      )
                    }
                    <Form>
                      <SDCardStorageTable
                        pageNumber={pageNumber}
                        handleDelete={handleDelete}
                        downloadFiles={downloadFiles}
                        generatePaginatedCheckList={generatePaginatedCheckList}
                        storageFileType={storageFileType}
                        pageType={pageType}
                        isRootDirectory={isRootDirectory}
                        setFolderName={setFolderName}
                      />
                      <Pagination
                        name="page"
                        index={pageNumber}
                        size={ITEMS_PER_PAGE}
                        total={form.values.flat().length}
                        currentPageItemQuantity={form.values[pageNumber] ? form.values[pageNumber].length : 0}
                        hrefTemplate=""
                        setPageIndexState={setPage}
                      />
                    </Form>
                  </div>
                );
              }}
            </Formik>
            {/* download progress modal */}
            <CustomNotifyModal
              modalType="process"
              backdrop={progressStatus.zipDownloadFiles === STAGE_PROGRESS_STATUS.ERROR ? true : 'static'}
              isShowModal={isShowProgressModal}
              modalTitle={i18n.t('sdCard.storage.modal.downloadingTitle')}
              modalBody={[
                <StageProgress
                  key="stage 1"
                  title={i18n.t('sdCard.storage.modal.downloadingStage1Title')}
                  progressStatus={progressStatus.zipDownloadFiles}
                  progressPercentage={progressPercentage.zipDownloadFiles}
                />,
                <StageProgress
                  key="stage 2"
                  title={i18n.t('sdCard.storage.modal.downloadingStage2Title')}
                  progressStatus={progressStatus.downloadFiles}
                  progressPercentage={progressPercentage.downloadFiles}
                />
              ]}
              onHide={() => setIsShowProgressModal(false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

SDCardStorage.propTypes = {
  storage: PropTypes.shape({
    files: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      bytes: PropTypes.number,
      name: PropTypes.string,
      path: PropTypes.string,
      type: PropTypes.string
    })).isRequired,
    date: PropTypes.oneOfType([
      PropTypes.instanceOf(Date),
      PropTypes.instanceOf(dayjs)
    ]).isRequired,
    pageType: PropTypes.string.isRequired
  }),
  rootDirectoryName: PropTypes.arrayOf(PropTypes.shape({name: PropTypes.string}))
};

SDCardStorage.defaultProps = {rootDirectoryName: []};

export default withGlobalStatus(SDCardStorage);

