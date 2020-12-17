import React, {useState, useRef} from 'react';
import PropTypes from 'prop-types';
import CustomTooltip from '../../../core/components/tooltip';
import i18n from '../../../i18n';
import CameraSyncAddDevice from './members-cameraSync-add';
import api from '../../../core/apis/web-api';
import {Formik, Form, Field} from 'formik';
import {isArray} from '../../../core/utils';
import FormikEffect from '../../../core/components/formik-effect';

const CameraSync = ({cameraSync}) => {
  const [isShowModal, setIsShowModal] = useState(false);
  const [camera, setCamera] = useState(null);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const checkboxRef = useRef(null);

  const cameraList = cameraSync.map(device => ({
    ...device,
    isChecked: false
  }));

  const showModal = () => setIsShowModal(true);

  const hideModal = () => {
    setCamera(null);
    setIsShowModal(false);
  };

  const deleteCameraHandler = list => _ => {
    if (isArray(list)) {
      const itemsToDelete = list.filter(device => device.isChecked)
        .reduce((arr, item) => {
          arr.push(item.id);
          return arr;
        }, []);
      api.member.deleteCamera(itemsToDelete);
    } else {
      api.member.deleteCamera([list]);
    }
  };

  const editCameraHandler = camera => _ => {
    setCamera(camera);
    setIsShowModal(true);
  };

  const sync = values => {
    const checked = values.filter(device => device.isChecked);
    // Sync api
    console.log(JSON.stringify(checked, null, 2));
  };

  const selectAllHandler = form => _ => {
    let checkboxState = false;
    if (!isSelectAll) {
      checkboxState = true;
    }

    form.values.forEach((device, index) => {
      form.setFieldValue(`${index}.isChecked`, checkboxState);
    });
    setIsSelectAll(prevState => (!prevState));
  };

  const onChangeCardForm = ({nextValues}) => {
    // Condition check for indeterminate state for table header checkbox
    // Check if any checkboxes has been selected
    if (nextValues.some(device => device.isChecked)) {
      // Check if all checkboxes has been selected
      if (nextValues.some(device => !device.isChecked)) {
        checkboxRef.current.indeterminate = true;
      } else {
        // All checkboxes selected manually
        checkboxRef.current.indeterminate = false;
        setIsSelectAll(true);
      }
    } else {
      // No checkboxes has been selected
      checkboxRef.current.indeterminate = false;
      setIsSelectAll(false);
    }
  };

  return (
    <div>
      <Formik
        enableReinitialize
        initialValues={cameraList}
        onSubmit={sync}
      >
        {form => {
          const disableButton = !form.values.some(device => device.isChecked);
          return (
            <Form className="card-body">
              <FormikEffect onChange={onChangeCardForm}/>
              <div className="col-12">
                <button
                  className="btn btn-primary rounded-pill"
                  type="submit"
                  disabled={disableButton}
                >
                  <i className="fas fa-exchange-alt fa-fw mr-2"/>
                  {i18n.t('demo.userManagement.members.synchronize')}
                </button>
                <button
                  className="btn btn-outline-primary rounded-pill ml-3"
                  type="button"
                  disabled={disableButton}
                  onClick={deleteCameraHandler(form.values)}
                >
                  <i className="far fa-trash-alt fa-lg fa-fw mr-2"/>
                  {i18n.t('demo.userManagement.members.remove')}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-primary rounded-pill ml-3"
                  onClick={showModal}
                >
                  <i className="fas fa-plus fa-fw mr-2"/>
                  {i18n.t('common.button.add')}
                </button>

                <CameraSyncAddDevice
                  camera={camera}
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
                          ref={checkboxRef}
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
                      !cameraSync.length && (
                        <tr>
                          <td className="text-size-20 text-center" colSpan="10">
                            <i className="fas fa-frown-open fa-fw text-dark"/> {i18n.t('userManagement.members.noData')}
                          </td>
                        </tr>
                      )
                    }
                    {
                      cameraList.map((camera, index) => {
                        return (
                          <tr key={camera.id}>
                            <td className="text-center td-checkbox">
                              <Field
                                name={`${index}.isChecked`}
                                id={camera.id}
                                type="checkbox"
                              />
                              <label htmlFor={camera.id}/>
                            </td>
                            <td>
                              <CustomTooltip placement="top-start" title={camera.ip}>
                                <div>
                                  {camera.ip + ':' + camera.port}
                                </div>
                              </CustomTooltip>
                            </td>
                            <td>
                              <CustomTooltip placement="top-start" title={camera.deviceName}>
                                <div>
                                  {camera.deviceName}
                                </div>
                              </CustomTooltip>
                            </td>
                            <td className="text-left group-btn">
                              <button
                                className="btn btn-link"
                                type="button"
                                onClick={editCameraHandler(camera)}
                              >
                                <i className="fas fa-pen fa-lg fa-fw"/>
                              </button>
                              <button
                                className="btn btn-link"
                                type="button"
                                onClick={deleteCameraHandler(camera.id)}
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
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

CameraSync.propTypes = {cameraSync: PropTypes.array.isRequired};

export default CameraSync;

