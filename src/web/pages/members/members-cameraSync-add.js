import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import Modal from 'react-bootstrap/Modal';
import i18n from '../../../i18n';
import api from '../../../core/apis/web-api';
import Password from '../../../core/components/fields/password';
import {useContextState} from '../../stateProvider';

const CameraSyncAddDevice = ({camera, isShowModal, setIsShowModal}) => {
  const {isApiProcessing} = useContextState();

  const onSubmitForm = values => {
    if (camera) {
      return api.member.editCamera(values)
        .then(() => setIsShowModal(false));
    }

    api.member.addCamera(values)
      .then(() => setIsShowModal(false));
  };

  return (
    <Modal autoFocus={false} show={isShowModal} backdrop={isApiProcessing ? 'static' : true} onHide={() => setIsShowModal(false)}>
      <Modal.Header className="d-flex justify-content-between align-items-center">
        <Modal.Title as="h5">
          {camera ?
            i18n.t('demo.userManagement.members.modal.cameraSync.modifyCameraTitle') :
            i18n.t('demo.userManagement.members.modal.cameraSync.newCameraTitle')}
        </Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={camera || {
          ip: '',
          account: '',
          password: ''
        }}
        onSubmit={onSubmitForm}
      >
        {({errors, touched}) => (
          <Form>
            <div className="modal-body">
              <div className="form-group">
                <label>{i18n.t('demo.userManagement.members.ip')}</label>
                <Field
                  name="ip"
                  type="text"
                  placeholder={i18n.t('demo.userManagement.members.modal.cameraSync.ipPlaceholder')}
                  className={classNames('form-control', {'is-invalid': errors.ip && touched.ip})}
                />
                <ErrorMessage component="div" name="ip" className="invalid-feedback"/>
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
                  {camera ? i18n.t('common.button.confirm') : i18n.t('common.button.new')}
                </button>
              </div>
              <button
                disabled={isApiProcessing}
                className="btn btn-info btn-block m-0 rounded-pill"
                type="button"
                onClick={() => {
                  setIsShowModal(false);
                }}
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

CameraSyncAddDevice.propTypes = {
  camera: PropTypes.object,
  isShowModal: PropTypes.bool.isRequired,
  setIsShowModal: PropTypes.func.isRequired
};

export default CameraSyncAddDevice;

