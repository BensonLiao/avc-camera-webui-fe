import React, {useState} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import Modal from 'react-bootstrap/Modal';
import i18n from '../../../i18n';
import api from '../../../core/apis/web-api';
import Password from '../../../core/components/fields/password';
import {useContextState} from '../../stateProvider';
import {getRouter} from '@benson.liao/capybara-router';
import deviceSyncValidator from '../../validations/members/device-sync-validator';
import CustomNotifyModal from '../../../core/components/custom-notify-modal';

const DeviceSyncAddDevice = ({device, isShowDeviceModal, hideDeviceModal}) => {
  const {isApiProcessing} = useContextState();
  const [isShowApiProcessModal, setIsShowApiProcessModal] = useState(false);

  const hideApiProcessModal = () => setIsShowApiProcessModal(false);

  /**
   * Submit new or edit device info
   * @param {Object} values - Device information
   * @returns {void}
   */
  const onSubmitForm = values => {
    if (!values.port) {
      values.port = 8080;
    }

    localStorage.setItem('currentPage', 'sync');
    setIsShowApiProcessModal(true);
    hideDeviceModal();

    if (device) {
      api.member.editDevice(values)
        .then(getRouter().reload)
        .finally(hideApiProcessModal);
    } else {
      api.member.addDevice(values)
        .then(getRouter().reload)
        .finally(hideApiProcessModal);
    }
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
          initialValues={device || {
            ip: '',
            port: '',
            account: '',
            password: ''
          }}
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
};

DeviceSyncAddDevice.propTypes = {
  device: PropTypes.object,
  isShowDeviceModal: PropTypes.bool.isRequired,
  hideDeviceModal: PropTypes.func.isRequired
};

export default DeviceSyncAddDevice;

