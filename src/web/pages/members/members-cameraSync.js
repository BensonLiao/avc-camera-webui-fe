import React, {useState} from 'react';
import PropTypes from 'prop-types';
import CustomTooltip from '../../../core/components/tooltip';
import i18n from '../../../i18n';
import CameraSyncAddDevice from './members-cameraSync-add';
import api from '../../../core/apis/web-api';
import {Formik, Form, Field} from 'formik';

const CameraSync = ({cameraSync}) => {
  const [isShowModal, setIsShowModal] = useState(false);
  const [camera, setCamera] = useState(null);

  const cameraList = cameraSync.map(device => ({
    ...device,
    isChecked: false
  }));

  const showModal = () => setIsShowModal(true);

  const hideModal = () => {
    setCamera(null);
    setIsShowModal(false);
  };

  const deleteCameraHandler = id => _ => {
    api.member.deleteCamera(id);
  };

  const editCameraHandler = camera => _ => {
    setCamera(camera);
    setIsShowModal(true);
  };

  const sync = values => {
    console.log(values);
  };

  const generateInitalValues = form => _ => {
    form.values.forEach((device, index) => {
      form.setFieldValue(`${index}.isChecked`, true);
    });
  };

  return (
    <div>
      <Formik
        enableReinitialize
        initialValues={cameraList}
        onSubmit={sync}
      >
        {form => {
          console.log('rerender');
          return (
            <Form className="card-body">
              <div className="col-12 mb-4">
                <button className="btn btn-outline-primary rounded-pill px-3 ml-3" type="button" onClick={generateInitalValues(form)}>
                  {i18n.t('demo.userManagement.members.selectAll')}
                </button>
                <button className="btn btn-outline-danger rounded-pill px-3 ml-3" type="button">
                  {i18n.t('demo.userManagement.members.delete')}
                </button>
                <button className="btn btn-outline-success rounded-pill px-3 ml-5" type="submit">
                  {i18n.t('demo.userManagement.members.syncCameras')}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-primary rounded-pill float-right"
                  onClick={showModal}
                >
                  {i18n.t('demo.userManagement.members.addDevice')}
                </button>

                <CameraSyncAddDevice
                  camera={camera}
                  isShowModal={isShowModal}
                  hideModal={hideModal}
                />
              </div>
              <div className="col-12 mb-5 table-responsive">
                <table className="table custom-style">
                  <thead>
                    <tr className="shadow">
                      <th className="text-center" style={{width: '10%'}}>{i18n.t('demo.userManagement.members.select')}</th>
                      <th style={{width: '30%'}}>
                        {i18n.t('demo.userManagement.members.ip')}
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
                            <td style={{position: 'relative'}} className="text-center">
                              <Field
                                name={`${index}.isChecked`}
                                id={camera.id}
                                type="checkbox"
                                style={{
                                  width: '16px',
                                  height: '16px'
                                }}

                              />
                              <label
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  left: 0,
                                  top: 0,
                                  position: 'absolute'
                                }}
                                htmlFor={camera.id}
                              />
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

