import React, {useState, useRef} from 'react';
import PropTypes from 'prop-types';
import {getRouter} from '@benson.liao/capybara-router';
import download from 'downloadjs';
import filesize from 'filesize';
import progress from 'nprogress';
import i18n from '../../../i18n';
import api from '../../../core/apis/web-api';
import wrappedApi from '../../../core/apis';
import {Formik, Form} from 'formik';
import {getPaginatedData, isArray} from '../../../core/utils';
import BreadCrumb from '../../../core/components/fields/breadcrumb';
import noFile from '../../../resource/noFile.png';
import Pagination from '../../../core/components/pagination';
import classNames from 'classnames';
import {SDCARD_STORAGE_DATE_FORMAT} from '../../../core/constants';
import CustomNotifyModal from '../../../core/components/custom-notify-modal';
import CustomTooltip from '../../../core/components/tooltip';
import StageProgress from '../../../core/components/stage-progress';
import TableWithCheckBox from '../../../core/components/checkbox-table';
import CheckboxBody from '../../../core/components/fields/checkbox-body';
import CheckboxHeader from '../../../core/components/fields/checkbox-header';
import SDCardStorageSearchForm from './sd-card-storage-search-form';
import dayjs from 'dayjs';
const ITEMS_PER_PAGE = 10;

const SDCardStorage = ({storage: {files, date}, dateList: availableDates}) => {
  const [pageNumber, setPage] = useState(0);
  const [isShowConfirmModal, setIsShowConfirmModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState();
  const [isShowApiProcessModal, setIsShowApiProcessModal] = useState(false);
  const [isShowProgressModal, setIsShowProgressModal] = useState(false);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [currentDate, setCurrentDate] = useState(date);
  const formRef = useRef();

  const generatePaginatedCheckList = files => {
    return getPaginatedData(files.map(file => ({
      ...file,
      isChecked: false
    })), ITEMS_PER_PAGE);
  };

  const getFinalSelectedList = list => isArray(list) ?
    list.flat().filter(value => value.isChecked).map(value => value.path) :
    [list];

  const showConfirmModal = () => setIsShowConfirmModal(true);

  const hideConfirmModal = () => setIsShowConfirmModal(false);

  const hideApiProcessModal = () => setIsShowApiProcessModal(false);

  /**
   * Delete selected file
   * @param {Array | String} list - Single or multilple files to be deleted
   * @returns {void}
   */
  const deleteFiles = list => _ => {
    hideConfirmModal();
    setIsShowApiProcessModal(true);
    api.system.deleteSDCardStorageFiles(getFinalSelectedList(list))
      .then(getRouter().reload)
      .finally(hideApiProcessModal);
  };

  const confirmDelete = (filePath = null) => _ => {
    showConfirmModal(true);
    setFileToDelete(filePath);
  };

  const downloadFiles = list => {
    progress.start();
    setIsShowProgressModal(true);
    setProgressPercentage(0);
    wrappedApi({
      method: 'post',
      url: '/api/system/systeminfo/sdcard-storage/download',
      responseType: 'blob',
      data: {files: getFinalSelectedList(list)},
      onDownloadProgress: progressEvent => {
        // Do whatever you want with the native progress event
        setProgressPercentage(Math.round((progressEvent.loaded / progressEvent.total) * 100));
      }
    })
      .then(response => {
        download(response.data, 'sdcard_files');
      })
      .finally(() => {
        progress.done();
        setIsShowProgressModal(false);
      });
  };

  return (
    <div className="main-content left-menu-active bg-white">
      <div className="section-media">
        <div className="container-fluid">
          <div className="row">
            <BreadCrumb
              className="px-0"
              path={[i18n.t('navigation.sidebar.sdCardSettings'), i18n.t('navigation.sidebar.storage')]}
              routes={['/sd-card/settings']}
            />
            <Formik
              innerRef={formRef}
              initialValues={generatePaginatedCheckList(files)}
            >
              {form => {
                const disableButton = !form.values.flat().some(value => value.isChecked);
                return (
                  <Form className="card-body">
                    <div className="col-12 d-flex justify-content-between align-items-center mb-4">
                      <SDCardStorageSearchForm
                        generatePaginatedCheckList={generatePaginatedCheckList}
                        initialSearchCondition={{date: currentDate}}
                        availableDates={availableDates}
                        setCurrentDate={setCurrentDate}
                        updateSearchResult={values => form.setValues(values)}
                      />
                      <div className="float-right d-inline-flex">
                        <CustomTooltip placement="top" show={disableButton} title={i18n.t('sdCard.storage.tooltip.noFile')}>
                          <div className="ml-3">
                            <button
                              className="btn btn-outline-primary rounded-pill"
                              type="button"
                              disabled={disableButton}
                              style={{pointerEvents: disableButton ? 'none' : 'auto'}}
                              onClick={() => downloadFiles(form.values)}
                            >
                              <i className="fas fa-download mr-2"/>
                              {i18n.t('sdCard.storage.button.download')}
                            </button>
                          </div>
                        </CustomTooltip>
                        <CustomTooltip placement="top" show={disableButton} title={i18n.t('sdCard.storage.tooltip.noFile')}>
                          <div className="ml-3">
                            <button
                              className="btn btn-outline-primary rounded-pill"
                              type="button"
                              disabled={disableButton}
                              style={{pointerEvents: disableButton ? 'none' : 'auto'}}
                              onClick={confirmDelete()}
                            >
                              <i className="far fa-trash-alt fa-lg fa-fw mr-2"/>
                              {i18n.t('sdCard.storage.button.remove')}
                            </button>
                          </div>
                        </CustomTooltip>
                      </div>
                    </div>
                    <TableWithCheckBox
                      formRef={formRef}
                      pageNumber={pageNumber}
                    >
                      <thead>
                        <tr className="shadow">
                          <CheckboxHeader formikForm={form}/>
                          <th style={{width: '15%'}}>{i18n.t('sdCard.storage.files.date')}</th>
                          <th style={{width: '25%'}}>{i18n.t('sdCard.storage.files.name')}</th>
                          <th style={{width: '25%'}}>{i18n.t('sdCard.storage.files.size')}</th>
                          <th style={{width: '15%'}}>{i18n.t('sdCard.storage.files.actions')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          form.values.length && form.values[pageNumber].length ? (
                            form.values[pageNumber] && form.values[pageNumber].map((pageData, index) => {
                              return (
                                <tr
                                  key={pageData.path}
                                  className={classNames(
                                    {
                                      checked: form.values[pageNumber] &&
                                        form.values[pageNumber][index] &&
                                        form.values[pageNumber][index].isChecked
                                    }
                                  )}
                                >
                                  <CheckboxBody id={pageData.path} pageNumber={pageNumber} index={index}/>
                                  <td>
                                    {currentDate.format(SDCARD_STORAGE_DATE_FORMAT.DISPLAY)}
                                  </td>
                                  <td>
                                    <CustomTooltip placement="top-start" title={pageData.name}>
                                      <div>
                                        {pageData.name}
                                      </div>
                                    </CustomTooltip>
                                  </td>
                                  <td>
                                    {filesize(pageData.bytes)}
                                  </td>
                                  <td className="text-left group-btn">
                                    <button
                                      className="btn btn-link"
                                      type="button"
                                      onClick={() => downloadFiles(pageData.path)}
                                    >
                                      <i className="fas fa-download"/>
                                    </button>
                                    <button
                                      className="btn btn-link"
                                      type="button"
                                      onClick={confirmDelete(pageData.path)}
                                    >
                                      <i className="far fa-trash-alt fa-lg fa-fw"/>
                                    </button>
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                          /* No File */
                            <tr className="disable-highlight">
                              <td className="text-size-20 text-center" colSpan="10">
                                <div className="d-flex flex-column align-items-center mt-5">
                                  <img src={noFile}/>
                                  <div className="mt-5 text-center text-wrap" style={{width: '300px'}}>
                                    {i18n.t('sdCard.storage.noFile')}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )
                        }
                      </tbody>
                    </TableWithCheckBox>

                    <Pagination
                      name="page"
                      index={pageNumber}
                      size={ITEMS_PER_PAGE}
                      total={form.values.flat().length}
                      currentPageItemQuantity={form.values[pageNumber] ? form.values[pageNumber].length : 0}
                      hrefTemplate=""
                      setPageIndexState={setPage}
                    />
                    {/* Delete confirmation */}
                    <CustomNotifyModal
                      backdrop="static"
                      isShowModal={isShowConfirmModal}
                      modalTitle={i18n.t('sdCard.storage.modal.confirmDeleteTitle')}
                      modalBody={i18n.t('sdCard.storage.modal.confirmDeleteBody')}
                      onHide={hideConfirmModal}
                      onConfirm={deleteFiles(fileToDelete ? fileToDelete : form.values)}
                    />
                  </Form>
                );
              }}
            </Formik>
            {/* API processing modal */}
            <CustomNotifyModal
              modalType="process"
              backdrop="static"
              isShowModal={isShowApiProcessModal}
              modalTitle={i18n.t('sdCard.storage.modal.deleteFileApiProcessing')}
              onHide={hideApiProcessModal}
            />
            {/* download progress modal */}
            <CustomNotifyModal
              modalType="process"
              backdrop="static"
              isShowModal={isShowProgressModal}
              modalTitle={i18n.t('sdCard.storage.modal.downloadingTitle')}
              modalBody={[
                <StageProgress
                  key="stage 1"
                  title={i18n.t('sdCard.storage.modal.downloadingBody')}
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
    ]).isRequired
  }),
  dateList: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default SDCardStorage;

