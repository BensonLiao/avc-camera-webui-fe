import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import Modal from 'react-bootstrap/Modal';
import i18n from '../../../i18n';
import api from '../../../core/apis/web-api';
import Password from '../../../core/components/fields/password';
import {useContextState} from '../../stateProvider';
import {getRouter} from '@benson.liao/capybara-router';

const DeviceSyncAddDevice = ({device, isShowModal, hideModal}) => {
  const {isApiProcessing} = useContextState();

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

    if (device) {
      api.member.editDevice(values)
        .then(hideModal)
        .then(getRouter().reload());
    } else {
      api.member.addDevice(values)
        .then(hideModal)
        .then(getRouter().reload());
    }
  };

  return (
    <Modal autoFocus={false} show={isShowModal} backdrop={isApiProcessing ? 'static' : true} onHide={hideModal}>
      <Modal.Header className="d-flex justify-content-between align-items-center">
        <Modal.Title as="h5">
          {device ?
            i18n.t('demo.userManagement.members.modal.deviceSync.modifyDeviceTitle') :
            i18n.t('demo.userManagement.members.modal.deviceSync.newDeviceTitle')}
        </Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={device || {
          ip: '',
          port: '',
          account: '',
          password: ''
        }}
        onSubmit={onSubmitForm}
      >
        {({errors, touched}) => (
          <Form>
            <div className="modal-body">
              <div className="form-group row">
                <div className="col-8">
                  <label>{i18n.t('demo.userManagement.members.host')}</label>
                  <Field
                    name="ip"
                    type="text"
                    placeholder={i18n.t('demo.userManagement.members.modal.deviceSync.hostPlaceholder')}
                    className={classNames('form-control', {'is-invalid': errors.ip && touched.ip})}
                  />
                  <ErrorMessage component="div" name="ip" className="invalid-feedback"/>
                </div>
                <div className="col-4">
                  <label>{i18n.t('demo.userManagement.members.modal.deviceSync.port')}</label>
                  <Field
                    name="port"
                    type="text"
                    placeholder={i18n.t('demo.userManagement.members.modal.deviceSync.portPlaceholder')}
                    className={classNames('form-control', {'is-invalid': errors.ip && touched.ip})}
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
                onClick={hideModal}
              >
                {i18n.t('common.button.close')}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

DeviceSyncAddDevice.propTypes = {
  device: PropTypes.object,
  isShowModal: PropTypes.bool.isRequired,
  hideModal: PropTypes.func.isRequired
};

export default DeviceSyncAddDevice;

