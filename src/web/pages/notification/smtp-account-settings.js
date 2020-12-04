import classNames from 'classnames';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import Modal from 'react-bootstrap/Modal';
import React from 'react';
import SMTPEncryptionType from 'webserver-form-schema/constants/smtp-encryption-type';
import SMTPPort from 'webserver-form-schema/constants/smtp-port';
import i18n from '../../../i18n';
import Password from '../../../core/components/fields/password';
import PropTypes from 'prop-types';
import smtpAccountSettingsValidator from '../../validations/notifications/smtp-account-settings-validator';

const SMTPAccountSettings = ({accountSettings, isShowModal, setIsShowAccountModal, onSubmitAccountSettingsForm}) => {
  return (
    <Modal autoFocus={false} show={isShowModal} onHide={() => setIsShowAccountModal(false)}>
      <div className="modal-header">
        <h5 className="modal-title">{i18n.t('SMTP Logon Settings')}</h5>
      </div>
      <Formik
        validate={smtpAccountSettingsValidator}
        initialValues={accountSettings}
        onSubmit={onSubmitAccountSettingsForm}
      >
        {({errors, touched}) => (
          <Form>
            <div className="modal-body">
              <div className="form-group">
                <label>{i18n.t('Account')}</label>
                <Field
                  name="account"
                  type="text"
                  className={classNames('form-control', {'is-invalid': errors.account && touched.account})}
                  placeholder={i18n.t('Enter your account')}
                />
                <ErrorMessage component="div" name="account" className="invalid-feedback"/>
              </div>
              <div className="form-group has-feedback">
                <label>{i18n.t('Password')}</label>
                <Field
                  name="password"
                  component={Password}
                  inputProps={{
                    className: classNames('form-control', {'is-invalid': errors.password && touched.password}),
                    placeholder: i18n.t('Enter your password')
                  }}
                />
                <ErrorMessage component="div" name="password" className="invalid-feedback"/>
              </div>
              <div className="form-group">
                <label>{i18n.t('Port')}</label>
                <div className="d-flex align-items-center">
                  {
                    ['25', '465', '587', '2525'].map((port, index) => (
                      <div key={port} className={classNames('form-check', {'ml-5': index !== 0})}>
                        <Field name="port" className="form-check-input" type="radio" id={`input-port-${port}`} value={SMTPPort[port]}/>
                        <label className="form-check-label" htmlFor={`input-port-${port}`}>{port}</label>
                      </div>
                    ))
                  }
                </div>
              </div>
              <div className="form-group">
                <label>{i18n.t('Encryption')}</label>
                <div className="d-flex align-items-center">
                  {
                    ['none', 'ssl', 'tls'].map((type, index) => (
                      <div key={type} className={classNames('form-check', {'ml-5': index !== 0})}>
                        <Field name="encryption" className="form-check-input" type="radio" id={`input-encryption-${type}`} value={SMTPEncryptionType[type]}/>
                        <label className="form-check-label" htmlFor={`input-encryption-${type}`}>{i18n.t(type)}</label>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
            <div className="modal-footer flex-column">
              <div className="form-group w-100 mx-0">
                <button type="submit" className="btn btn-primary btn-block rounded-pill">
                  {i18n.t('common.button.apply')}
                </button>
              </div>
              <button type="button" className="btn btn-info btn-block m-0 rounded-pill" onClick={() => setIsShowAccountModal(false)}>
                {i18n.t('common.button.close')}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

SMTPAccountSettings.propTypes = {
  accountSettings: PropTypes.shape({
    encryption: PropTypes.oneOf(SMTPEncryptionType.all()),
    port: PropTypes.oneOf(SMTPPort.all()),
    account: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired
  }).isRequired,
  isShowModal: PropTypes.bool.isRequired,
  setIsShowAccountModal: PropTypes.func.isRequired,
  onSubmitAccountSettingsForm: PropTypes.func.isRequired
};

export default SMTPAccountSettings;
