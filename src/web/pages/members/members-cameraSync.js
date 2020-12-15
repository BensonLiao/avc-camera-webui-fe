import React, {useState} from 'react';
import PropTypes from 'prop-types';
import CustomTooltip from '../../../core/components/tooltip';
import i18n from '../../../i18n';
import CameraSyncAddDevice from './members-cameraSync-add';
import api from '../../../core/apis/web-api';

const CameraSync = ({cameraSync}) => {
  const [isShowModal, setIsShowModal] = useState(false);
  const [camera, setCamera] = useState(null);

  const showModal = () => setIsShowModal(true);

  const deleteCameraHandler = id => _ => {
    api.member.deleteCamera(id);
  };

  const editCameraHandler = camera => _ => {
    setCamera(camera);
    setIsShowModal(true);
  };

  return (
    <div>
      <div className="col-12 mb-4">
        <button className="btn btn-outline-primary rounded-pill px-3 ml-3" type="submit">
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
          setIsShowModal={setIsShowModal}
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
              cameraSync.map(camera => {
                return (
                  <tr key={camera.ip}>
                    <td className="text-center">
                      <input type="checkbox"/>
                    </td>
                    <td>
                      <CustomTooltip placement="top-start" title={camera.ip}>
                        <div>
                          {camera.ip}
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
    </div>
  );
};

CameraSync.propTypes = {cameraSync: PropTypes.array.isRequired};

export default CameraSync;

