import React, {useState} from 'react';
import progress from 'nprogress';
import PropTypes from 'prop-types';
import download from 'downloadjs';
import api from '../../../core/apis/web-api';
import CustomTooltip from '../../../core/components/tooltip';
import i18n from '../../../i18n';
import {useContextState} from '../../stateProvider';
import utils from '../../../core/utils';

const MaintainImportExport = ({
  setApiProcessModal,
  hideApiProcessModal,
  setFinishModal
}) => {
  const {isApiProcessing} = useContextState();

  const [file, setFile] = useState(null);

  const onChangeFile = event => {
    setFile(event.target.files[0]);
  };

  const onClickExportDeviceSettings = event => {
    event.preventDefault();
    download('/api/system/device_settings.zip');
  };

  const onSubmitImportDeviceSettings = () => {
    progress.start();
    setApiProcessModal({
      isShowApiProcessModal: true,
      apiProcessModalTitle: i18n.t('Importing Device Settings')
    });
    api.system.importDeviceSettings(file)
      .then(() => {
        api.system.deviceReboot()
          .then(() => new Promise(resolve => {
            // Check the server was shut down, if success then shutdown was failed and retry.
            utils.pingToCheckShutdown(resolve, 1000);
          }))
          .then(() => {
            // Keep modal and update the title.
            setApiProcessModal(prevState => ({
              ...prevState,
              apiProcessModalTitle: i18n.t('Rebooting')
            }));
            // Check the server was start up, if success then startup was failed and retry.
            const test = () => {
              api.ping('app')
                .then(() => {
                  progress.done();
                  hideApiProcessModal();
                  setFinishModal({
                    isShowFinishModal: true,
                    finishModalTitle: i18n.t('Import System Settings'),
                    finishModalBody: i18n.t('Device settings have imported. Please log in again.')
                  });
                })
                .catch(() => {
                  setTimeout(test, 1000);
                });
            };

            test();
          })
          .catch(() => {
            progress.done();
            hideApiProcessModal();
          });
      })
      .catch(() => {
        progress.done();
        hideApiProcessModal();
      });
  };

  return (
    <>
      <div className="form-group">
        <label>{i18n.t('Export System Settings')}</label>
        <div>
          <button
            className="btn btn-outline-primary rounded-pill px-5"
            type="button"
            onClick={onClickExportDeviceSettings}
          >
            {i18n.t('Export')}
          </button>
        </div>
      </div>
      <div className="form-group">
        <label className="mb-0">{i18n.t('Import System Settings')}</label>
        <small className="form-text text-muted my-2">{i18n.t('Only ZIP file format is supported')}</small>
        <div>
          <label className="btn btn-outline-primary rounded-pill font-weight-bold px-5">
            <input type="file" className="d-none" accept="application/zip" onChange={onChangeFile}/>
            {i18n.t('Select File')}
          </label>
          {
            file ?
              <span className="text-size-14 text-muted ml-3">{i18n.t(file.name)}</span> :
              <span className="text-size-14 text-muted ml-3">{i18n.t('No file selected.')}</span>
          }
        </div>
        <div>
          <CustomTooltip show={!file} title={i18n.t('Please select a file first.')}>
            <span>
              <button
                disabled={isApiProcessing || !file}
                className="btn btn-outline-primary rounded-pill px-5"
                type="button"
                style={file ? {} : {pointerEvents: 'none'}}
                onClick={onSubmitImportDeviceSettings}
              >
                {i18n.t('Import')}
              </button>
            </span>
          </CustomTooltip>
        </div>
      </div>
    </>
  );
};

MaintainImportExport.propTypes = {
  setApiProcessModal: PropTypes.func.isRequired,
  hideApiProcessModal: PropTypes.func.isRequired,
  setFinishModal: PropTypes.func.isRequired
};

export default MaintainImportExport;
