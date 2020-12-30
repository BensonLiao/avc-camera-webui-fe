import React, {useState, useRef, useEffect, useCallback} from 'react';
import PropTypes from 'prop-types';
import {getRouter} from '@benson.liao/capybara-router';
import download from 'downloadjs';
import progress from 'nprogress';
import i18n from '../../../i18n';
import api from '../../../core/apis/web-api';
import wrappedApi from '../../../core/apis';
import {Formik, Form, Field} from 'formik';
import {getPaginatedData, isArray} from '../../../core/utils';
import BreadCrumb from '../../../core/components/fields/breadcrumb';
import FormikEffect from '../../../core/components/formik-effect';
import noDevice from '../../../resource/noDevice.png';
import Pagination from '../../../core/components/pagination';
import classNames from 'classnames';
import CustomNotifyModal from '../../../core/components/custom-notify-modal';
import CustomTooltip from '../../../core/components/tooltip';
import StageProgress from '../../../core/components/stage-progress';
import SDCardStorageSearchForm from './sd-card-storage-search-form';

const SDCardStorage = ({files, dateList}) => {
  console.log('dateList', dateList);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [page, setPage] = useState(0);
  const [isShowConfirmModal, setIsShowConfirmModal] = useState(false);
  const [deleteFile, setDeleteFile] = useState();
  const [isShowApiProcessModal, setIsShowApiProcessModal] = useState(false);
  const [isShowProgressModal, setIsShowProgressModal] = useState(false);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const selectAllRef = useRef();
  const formRef = useRef();

  const generatePaginatedCheckList = files => {
    return getPaginatedData(files.map(file => ({
      ...file,
      isChecked: false
    })), 5);
  };

  const getFinalSelectedList = list => isArray(list) ?
    list.flat().filter(value => value.isChecked).map(value => value.path) :
    [list];

  const [paginatedCheckList] = useState(generatePaginatedCheckList(files));

  const showConfirmModal = () => setIsShowConfirmModal(true);

  const hideConfirmModal = () => setIsShowConfirmModal(false);

  const hideApiProcessModal = () => setIsShowApiProcessModal(false);

  /**
   * Delete selected device
   * @param {Array | String} list - Single device ID or a list to filter for devices selected to be deleted
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
    setDeleteFile(filePath);
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

  /**
   * Select or un-select all checkboxes on current page
   * @param {Object} form - Formik form object
   * @returns {void}
   */
  const selectAllHandler = form => _ => {
    let checkboxState = false;
    if (!isSelectAll) {
      checkboxState = true;
    }

    if (form.values[page]) {
      form.values[page].forEach((_, index) => {
        form.setFieldValue(`${page}.${index}.isChecked`, checkboxState);
      });
    }

    setIsSelectAll(prevState => (!prevState));
  };

  /**
   * Update `Select All` checkbox based on page navigated to
   */
  useEffect(() => {
    // Crash prevention fallback if React is less than v2.2.0, innerRef only exists after v2.2.0
    if (formRef.current) {
      const values = formRef.current.values;
      selectAllCheckboxState(values);
    }
  }, [page, selectAllCheckboxState]);

  /**
   * Update `Select All` checkbox based on any checkbox update
   * @param {Object} values - Form next values
   * @returns {void}
   */
  const onChangeCardForm = ({nextValues}) => {
    if (files.length) {
      selectAllCheckboxState(nextValues);
    }
  };

  /**
   * Determine condition for table header checkbox indeterminate, check or unchecked state
   * @param {Object} values - Form values
   * @returns {void}
   */
  const selectAllCheckboxState = useCallback(values => {
    // Check if any checkboxes has been selected
    if (values[page] && values[page].some(device => device.isChecked)) {
      // Check if all checkboxes has been selected
      if (values[page].some(device => !device.isChecked)) {
        selectAllRef.current.indeterminate = true;
      } else {
        // All checkboxes selected manually
        selectAllRef.current.indeterminate = false;
        setIsSelectAll(true);
      }
    } else {
      // No checkboxes has been selected
      selectAllRef.current.indeterminate = false;
      setIsSelectAll(false);
    }
  }, [page]);

  return (
    <div className="main-content left-menu-active">
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
              initialValues={paginatedCheckList}
            >
              {form => {
                const disableButton = !form.values.flat().some(value => value.isChecked);
                return (
                  <Form className="card-body">
                    <FormikEffect onChange={onChangeCardForm}/>
                    <div className="col-12 d-flex justify-content-between align-items-center mb-4">
                      <SDCardStorageSearchForm
                        generatePaginatedCheckList={generatePaginatedCheckList}
                        updateSearchResult={values => form.setValues(values)}
                      />
                      <div className="float-right d-inline-flex">
                        <CustomTooltip placement="top" show={disableButton} title={i18n.t('userManagement.members.tooltip.noDevice')}>
                          <div className="ml-3">
                            <button
                              className="btn btn-outline-primary rounded-pill"
                              type="button"
                              disabled={disableButton}
                              style={{pointerEvents: disableButton ? 'none' : 'auto'}}
                              onClick={confirmDelete()}
                            >
                              <i className="far fa-trash-alt fa-lg fa-fw mr-2"/>
                              {i18n.t('userManagement.members.remove')}
                            </button>
                          </div>
                        </CustomTooltip>
                        <CustomTooltip placement="top" show={disableButton} title={i18n.t('userManagement.members.tooltip.noDevice')}>
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
                      </div>
                    </div>
                    <div className="col-12 pt-4 mb-5 table-responsive">
                      <table className="table custom-style">
                        <thead>
                          <tr className="shadow">
                            <th
                              className="text-center th-checkbox"
                              style={{width: '10%'}}
                            >
                              <input
                                ref={selectAllRef}
                                id="selectAll"
                                type="checkbox"
                                indeterminate="true"
                                checked={isSelectAll}
                                onChange={selectAllHandler(form)}
                              />
                              <label htmlFor="selectAll"/>
                            </th>
                            <th style={{width: '15%'}}>{i18n.t('sdCard.storage.files.date')}</th>
                            <th style={{width: '25%'}}>{i18n.t('sdCard.storage.files.name')}</th>
                            <th style={{width: '25%'}}>{i18n.t('sdCard.storage.files.size')}</th>
                            <th style={{width: '15%'}}>{i18n.t('sdCard.storage.files.actions')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            form.values.length && form.values[page].length ? (
                              form.values[page] && form.values[page].map((pageData, index) => {
                                return (
                                  <tr
                                    key={pageData.path}
                                    className={classNames(
                                      {checked: form.values[page] && form.values[page][index] && form.values[page][index].isChecked}
                                    )}
                                  >
                                    <td className="text-center td-checkbox">
                                      <Field
                                        name={`${page}.${index}.isChecked`}
                                        id={pageData.path}
                                        type="checkbox"
                                      />
                                      <label htmlFor={pageData.path}/>
                                    </td>
                                    <td>
                                      <CustomTooltip placement="top-start" title={pageData.ip}>
                                        <div>
                                          2020-20-11
                                        </div>
                                      </CustomTooltip>
                                    </td>
                                    <td>
                                      <CustomTooltip placement="top-start" title={pageData.name}>
                                        <div>
                                          {pageData.name}
                                        </div>
                                      </CustomTooltip>
                                    </td>
                                    <td>
                                      <CustomTooltip placement="top-start" title={pageData.bytes}>
                                        <div>
                                          {pageData.bytes}
                                        </div>
                                      </CustomTooltip>
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
                              /* No Device */
                              <tr className="disable-highlight">
                                <td className="text-size-20 text-center" colSpan="10">
                                  <div className="d-flex flex-column align-items-center mt-5">
                                    <img src={noDevice}/>
                                    <div className="mt-5 text-center text-wrap" style={{width: '300px'}}>{i18n.t('userManagement.members.noDevice')}</div>
                                  </div>
                                </td>
                              </tr>
                            )
                          }
                        </tbody>
                      </table>
                    </div>
                    <Pagination
                      name="page"
                      index={page}
                      size={5}
                      total={form.values.flat().length}
                      currentPageItemQuantity={form.values[page] ? form.values[page].length : 0}
                      hrefTemplate=""
                      setPageIndexState={setPage}
                    />
                    {/* Delete confirmation */}
                    <CustomNotifyModal
                      backdrop="static"
                      isShowModal={isShowConfirmModal}
                      modalTitle={i18n.t('userManagement.members.modal.SDCardStorage.confirmDeleteTitle')}
                      modalBody={i18n.t('userManagement.members.modal.SDCardStorage.confirmDeleteBody')}
                      onHide={hideConfirmModal}
                      onConfirm={deleteFiles(deleteFile ? deleteFile : form.values)}
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
              modalTitle={i18n.t('userManagement.members.modal.SDCardStorage.deleteDeviceApiProcessingModal')}
              onHide={hideApiProcessModal}
            />
            {/* download progress modal */}
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
  );
};

SDCardStorage.propTypes = {
  files: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    bytes: PropTypes.number,
    name: PropTypes.string,
    path: PropTypes.string,
    type: PropTypes.string
  })).isRequired,
  dateList: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default SDCardStorage;

