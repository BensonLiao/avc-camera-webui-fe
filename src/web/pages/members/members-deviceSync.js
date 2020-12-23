import React, {useState, useRef, useEffect, useCallback} from 'react';
import PropTypes from 'prop-types';
import {getRouter} from '@benson.liao/capybara-router';
import CustomTooltip from '../../../core/components/tooltip';
import i18n from '../../../i18n';
import DeviceSyncAddDevice from './members-deviceSync-add';
import api from '../../../core/apis/web-api';
import {Formik, Form, Field} from 'formik';
import {getPaginatedData, isArray} from '../../../core/utils';
import FormikEffect from '../../../core/components/formik-effect';
import noDevice from '../../../resource/noDevice.png';
import Pagination from '../../../core/components/pagination';
import classNames from 'classnames';

const DeviceSync = ({deviceSync}) => {
  const [isShowModal, setIsShowModal] = useState(false);
  const [device, setDevice] = useState(null);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [page, setPage] = useState(0);
  const selectAllRef = useRef();
  const formRef = useRef();
  const deviceList = getPaginatedData(deviceSync.map(device => ({
    ...device,
    isChecked: false
  })), 5);
  const showModal = () => setIsShowModal(true);

  const hideModal = () => {
    setDevice(null);
    setIsShowModal(false);
  };

  /**
   * Condition check for indeterminate state for table header checkbox
   * @param {Array | String} list - Single device ID or a list to filter for devices selected to be deleted
   * @returns {void}
   */
  const deleteDeviceHandler = list => _ => {
    if (isArray(list)) {
      const itemsToDelete = list.flat().filter(device => device.isChecked)
        .reduce((arr, item) => {
          arr.push(item.id);
          return arr;
        }, []);
      // Delete multiple devices
      api.member.deleteDevice(itemsToDelete)
        .then(getRouter().reload());
    } else {
      // Delete single device
      api.member.deleteDevice([list])
        .then(getRouter().reload());
    }
  };

  /**
   * Edit selected device
   * @param {Object} device - individual device data
   * @returns {void}
   */
  const editDeviceHandler = device => _ => {
    setDevice(device);
    setIsShowModal(true);
  };

  const sync = values => {
    const checked = values.flat().filter(device => device.isChecked);
    // Sync api
    console.log(JSON.stringify(checked, null, 2));
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

    form.values[page].forEach((_, index) => {
      form.setFieldValue(`${page}.${index}.isChecked`, checkboxState);
    });
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
    if (deviceSync.length) {
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
    <div>
      <Formik
        innerRef={formRef}
        initialValues={deviceList}
        onSubmit={sync}
      >
        {form => {
          const disableButton = !form.values.flat().some(device => device.isChecked);
          return (
            <Form className="card-body">
              <FormikEffect onChange={onChangeCardForm}/>
              <div className="col-12 d-inline-flex">
                <CustomTooltip placement="auto" show={disableButton} title={i18n.t('demo.userManagement.members.tooltip.noDevice')}>
                  <div>
                    <button
                      className="btn btn-primary rounded-pill"
                      type="submit"
                      disabled={disableButton}
                      style={{pointerEvents: disableButton ? 'none' : 'auto'}}
                    >
                      <i className="fas fa-exchange-alt fa-fw mr-2"/>
                      {i18n.t('demo.userManagement.members.synchronize')}
                    </button>
                  </div>
                </CustomTooltip>
                <CustomTooltip placement="top" show={disableButton} title={i18n.t('demo.userManagement.members.tooltip.noDevice')}>
                  <div className="ml-3">
                    <button
                      className="btn btn-outline-primary rounded-pill"
                      type="button"
                      disabled={disableButton}
                      style={{pointerEvents: disableButton ? 'none' : 'auto'}}
                      onClick={deleteDeviceHandler(form.values)}
                    >
                      <i className="far fa-trash-alt fa-lg fa-fw mr-2"/>
                      {i18n.t('demo.userManagement.members.remove')}
                    </button>
                  </div>
                </CustomTooltip>
                <button
                  type="button"
                  className="btn btn-outline-primary rounded-pill ml-3"
                  onClick={showModal}
                >
                  <i className="fas fa-plus fa-fw mr-2"/>
                  {i18n.t('common.button.add')}
                </button>

                <DeviceSyncAddDevice
                  device={device}
                  isShowModal={isShowModal}
                  hideModal={hideModal}
                />
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
                      <th style={{width: '30%'}}>
                        {i18n.t('demo.userManagement.members.host')}
                        <i className="fas fa-fw text-muted ml-3"/>
                      </th>
                      <th style={{width: '35%'}}>
                        {i18n.t('demo.userManagement.members.deviceName')}
                        <i className="fas fa-fw text-muted ml-3"/>
                      </th>
                      <th style={{width: '15%'}}>{i18n.t('userManagement.members.actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      /* Empty Search Message */
                      !deviceSync.length && (
                        <tr className="disable-highlight">
                          <td className="text-size-20 text-center" colSpan="10">
                            <div className="d-flex flex-column align-items-center mt-5">
                              <img src={noDevice}/>
                              <div className="mt-5 text-center text-wrap" style={{width: '300px'}}>{i18n.t('demo.userManagement.members.noDevice')}</div>
                            </div>
                          </td>
                        </tr>
                      )
                    }
                    {
                      deviceList[page] && deviceList[page].map((device, index) => {
                        return (
                          <tr
                            key={device.id}
                            className={classNames({checked: form.values[page][index] && form.values[page][index].isChecked})}
                          >
                            <td className="text-center td-checkbox">
                              <Field
                                name={`${page}.${index}.isChecked`}
                                id={device.id}
                                type="checkbox"
                              />
                              <label htmlFor={device.id}/>
                            </td>
                            <td>
                              <CustomTooltip placement="top-start" title={device.ip}>
                                <div>
                                  {device.ip + ':' + device.port}
                                </div>
                              </CustomTooltip>
                            </td>
                            <td>
                              <CustomTooltip placement="top-start" title={device.deviceName}>
                                <div>
                                  {device.deviceName}
                                </div>
                              </CustomTooltip>
                            </td>
                            <td className="text-left group-btn">
                              <button
                                className="btn btn-link"
                                type="button"
                                onClick={editDeviceHandler(device)}
                              >
                                <i className="fas fa-pen fa-lg fa-fw"/>
                              </button>
                              <button
                                className="btn btn-link"
                                type="button"
                                onClick={deleteDeviceHandler(device.id)}
                              >
                                <i className="far fa-trash-alt fa-lg fa-fw"/>
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    }
                  </tbody>
                </table>
              </div>
              <Pagination
                name="page"
                index={page}
                size={5}
                total={deviceList.flat().length}
                currentPageItemQuantity={deviceSync.length && deviceList[page].length}
                hrefTemplate=""
                setPageIndexState={setPage}
              />
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

DeviceSync.propTypes = {deviceSync: PropTypes.array.isRequired};

export default DeviceSync;

