import classNames from 'classnames';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import Modal from 'react-bootstrap/Modal';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import api from '../../../core/apis/web-api';
import CustomNotifyModal from '../../../core/components/custom-notify-modal';
import deviceSyncValidator from '../../validations/members/device-sync-validator';
import {duplicateCheck} from '../../../core/utils';
import i18n from '../../../i18n';
import notify from '../../../core/notify';
import Password from '../../../core/components/fields/password';
import {useContextState} from '../../stateProvider';

const DeviceSyncAddDevice = React.memo(({device, devices, ipAddress, isShowDeviceModal, hideDeviceModal, setIsUpdateList}) => {
  const {isApiProcessing} = useContextState();
  const [isShowApiProcessModal, setIsShowApiProcessModal] = useState(false);
  const ipList = devices.reduce((arr, item) => {
    arr.push(item.ip);
    return arr;
  }, []);

  const hideApiProcessModal = () => setIsShowApiProcessModal(false);

  /**
   * Show device successfully connected toast modal
   * @returns {void}
   */
  const showSuccessMessage = () => {
    notify.showSuccessNotification({
      title: i18n.t('userManagement.members.toast.connectSuccessTitle'),
      message: i18n.t('userManagement.members.toast.connectSuccessBody')
    });
  };

  /**
   * Show device connection failed toast modal
   * @returns {void}
   */
  const showFailMessage = () => {
    notify.showErrorNotification({
      title: i18n.t('userManagement.members.toast.connectFailTitle'),
      message: i18n.t('userManagement.members.toast.connectFailBody')
    });
  };

  /**
   * Generate initial form data for Formik
   * @returns {Object} Device data
   */
  const generateInitialValue = () => {
    // Edit device
    if (device) {
      return {
        ...device,
        password: ''
      };
    }

    // Add new device
    return {
      ip: '',
      port: '',
      account: '',
      password: ''
    };
  };

  /**
   * Submit new or edit device info
   * @param {Object} values - Device information
   * @returns {void}
   */
  const onSubmitForm = values => {
    if (!values.port) {
      values.port = 80;
    }

    setIsShowApiProcessModal(true);
    hideDeviceModal();
    api.member[device ? 'editDevice' : 'addDevice'](values)
      .then(showSuccessMessage)
      .catch(showFailMessage)
      .finally(() => {
        hideApiProcessModal();
        setIsUpdateList(prevState => !prevState);
      });
  };

  /**
   * Validate IP
   * @param {String} value - IP
   * @returns {String} - Translated error message: Same IP as current device -OR- Duplicate IP
   */
  const validateIP = value => {
    if (ipAddress === value) {
      return i18n.t('validation.identicalIP');
    }

    return duplicateCheck(device ? ipList.filter(d => d !== device.ip) : ipList, value, i18n.t('validation.duplicateIP'));
  };

  return (
    <>
      <Modal autoFocus={false} show={isShowDeviceModal} backdrop={isApiProcessing ? 'static' : true} onHide={hideDeviceModal}>
        <Modal.Header className="d-flex justify-content-between align-items-center">
          <Modal.Title as="h5">
            {device ?
              i18n.t('userManagement.members.modal.deviceSync.modifyDeviceTitle') :
              i18n.t('userManagement.members.modal.deviceSync.newDeviceTitle')}
          </Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={generateInitialValue()}
          validate={deviceSyncValidator}
          onSubmit={onSubmitForm}
        >
          {({errors, touched}) => (
            <Form>
              <div className="modal-body">
                <div className="row">
                  <div className="form-group col-8">
                    <label>{i18n.t('userManagement.members.host')}</label>
                    <Field
                      name="ip"
                      type="text"
                      placeholder={i18n.t('userManagement.members.modal.deviceSync.hostPlaceholder')}
                      className={classNames('form-control', {'is-invalid': errors.ip && touched.ip})}
                      validate={validateIP}
                    />
                    <ErrorMessage component="div" name="ip" className="invalid-feedback"/>
                  </div>
                  <div className="form-group col-4">
                    <label>{i18n.t('userManagement.members.modal.deviceSync.port')}</label>
                    <Field
                      name="port"
                      type="text"
                      placeholder={i18n.t('userManagement.members.modal.deviceSync.portPlaceholder')}
                      className={classNames('form-control', {'is-invalid': errors.port && touched.port})}
                    />
                    <ErrorMessage component="div" name="port" className="invalid-feedback"/>
                  </div>
                </div>
                <div className="form-group">
                  <label>{i18n.t('userManagement.accounts.username')}</label>
                  <Field
                    name="account"
                    type="text"
                    placeholder={i18n.t('userManagement.accounts.modal.usernamePlaceholder')}
                    className={classNames('form-control', {'is-invalid': errors.account && touched.account})}
                  />
                  <ErrorMessage component="div" name="account" className="invalid-feedback"/>
                </div>
                <div className="form-group has-feedback">
                  <label>{i18n.t('common.password.password')}</label>
                  <Field
                    name="password"
                    component={Password}
                    inputProps={{
                      placeholder: i18n.t('common.password.passwordPlaceholder'),
                      className: classNames('form-control', {'is-invalid': errors.password && touched.password})
                    }}
                  />
                  <ErrorMessage component="div" name="password" className="invalid-feedback"/>
                </div>
              </div>
              <div className="modal-footer flex-column">
                <div className="form-group w-100 mx-0">
                  <button
                    disabled={isApiProcessing}
                    type="submit"
                    className="btn btn-primary btn-block rounded-pill"
                  >
                    {device ? i18n.t('common.button.confirm') : i18n.t('common.button.new')}
                  </button>
                </div>
                <button
                  disabled={isApiProcessing}
                  className="btn btn-info btn-block m-0 rounded-pill"
                  type="button"
                  onClick={hideDeviceModal}
                >
                  {i18n.t('common.button.close')}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
      {/* Database updating modal */}
      <CustomNotifyModal
        modalType="process"
        backdrop="static"
        isShowModal={isShowApiProcessModal}
        modalTitle={device ?
          i18n.t('userManagement.members.modal.deviceSync.addDeviceApiProcessingModal') :
          i18n.t('userManagement.members.modal.deviceSync.editDeviceApiProcessingModal')}
        onHide={hideApiProcessModal}
      />
    </>
  );
});

DeviceSyncAddDevice.propTypes = {
  device: PropTypes.shape({
    account: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    ip: PropTypes.string.isRequired,
    port: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    connectionStatus: PropTypes.number.isRequired,
    lastUpdateTime: PropTypes.number.isRequired,
    syncStatus: PropTypes.number.isRequired
  }),
  devices: PropTypes.arrayOf(
    PropTypes.shape({
      account: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      ip: PropTypes.string.isRequired,
      port: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      connectionStatus: PropTypes.number.isRequired,
      lastUpdateTime: PropTypes.number.isRequired,
      syncStatus: PropTypes.number.isRequired
    })
  ).isRequired,
  ipAddress: PropTypes.string.isRequired,
  isShowDeviceModal: PropTypes.bool.isRequired,
  hideDeviceModal: PropTypes.func.isRequired,
  setIsUpdateList: PropTypes.func.isRequired
};

DeviceSyncAddDevice.defaultProps = {device: null};

export default DeviceSyncAddDevice;

