import classNames from 'classnames';
import {Field} from 'formik';
import React, {useState, useRef, useEffect, useCallback} from 'react';
import PropTypes from 'prop-types';
import CustomTooltip from '../../../core/components/tooltip';
import FormikEffect from '../../../core/components/formik-effect';
import i18n from '../../../i18n';
import noDevice from '../../../resource/noDevice.png';
import DeviceSyncTableStatus from './members-deviceSync-table-status';

const DeviceSyncTable = ({
  devices,
  deviceList,
  syncStatus,
  form,
  formRef,
  pageNumber,
  confirmDelete,
  editDeviceHandler
}) => {
  const [isSelectAll, setIsSelectAll] = useState(false);
  const selectAllRef = useRef();

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

    if (form.values[pageNumber]) {
      form.values[pageNumber].forEach((_, index) => {
        form.setFieldValue(`${pageNumber}.${index}.isChecked`, checkboxState);
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
  }, [formRef, pageNumber, selectAllCheckboxState]);

  /**
   * Update `Select All` checkbox based on any checkbox update
   * @param {Object} nextValues - Form next values
   * @returns {void}
   */
  const onChangeCardForm = ({nextValues}) => {
    if (devices.length) {
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
    if (values[pageNumber] && values[pageNumber].some(device => device.isChecked)) {
      if (values[pageNumber].some(device => !device.isChecked)) {
        // Some checkboxes are selected, set to indetermindate state
        selectAllRef.current.indeterminate = true;
      } else {
        // Manually selected all checkboxes
        selectAllRef.current.indeterminate = false;
        setIsSelectAll(true);
      }
    } else {
      // No checkboxes has been selected
      selectAllRef.current.indeterminate = false;
      setIsSelectAll(false);
    }
  }, [pageNumber]);

  return (
    <>
      <div className="col-12 pt-4 mb-5 table-responsive">
        <FormikEffect onChange={onChangeCardForm}/>
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
              <th style={{width: '15%'}}>{i18n.t('userManagement.members.host')}</th>
              <th style={{width: '30%'}}>{i18n.t('userManagement.members.deviceName')}</th>
              <th style={{width: '30%'}}>{i18n.t('userManagement.members.status')}</th>
              <th style={{width: '15%'}}>{i18n.t('userManagement.members.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {
              devices.length ? (
                deviceList[pageNumber] && deviceList[pageNumber].map((device, index) => {
                  return (
                    <tr
                      key={device.id}
                      className={classNames({
                        checked: form.values[pageNumber] &&
                        form.values[pageNumber][index] &&
                        form.values[pageNumber][index].isChecked
                      })}
                    >
                      <td className="text-center td-checkbox">
                        <Field
                          name={`${pageNumber}.${index}.isChecked`}
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
                        <CustomTooltip placement="top-start" title={device.name}>
                          <div>
                            {device.name}
                          </div>
                        </CustomTooltip>
                      </td>
                      <td>
                        <div>
                          <DeviceSyncTableStatus
                            device={device}
                            syncStatus={syncStatus}
                          />
                        </div>
                      </td>
                      <td className="text-left group-btn">
                        {syncStatus ? (
                          <i className="fas fa-lg fa-ban"/>
                        ) : (
                          <>
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
                              onClick={confirmDelete(device.id)}
                            >
                              <i className="far fa-trash-alt fa-lg fa-fw"/>
                            </button>
                          </>
                        )}
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
    </>
  );
};

DeviceSyncTable.propTypes = {
  devices: PropTypes.arrayOf(PropTypes.shape(DeviceSyncTableStatus.propTypes.device)),
  syncStatus: DeviceSyncTableStatus.propTypes.syncStatus,
  deviceList: PropTypes.array.isRequired,
  form: PropTypes.object.isRequired,
  formRef: PropTypes.object.isRequired,
  pageNumber: PropTypes.number.isRequired,
  confirmDelete: PropTypes.func.isRequired,
  editDeviceHandler: PropTypes.func.isRequired
};

export default DeviceSyncTable;

