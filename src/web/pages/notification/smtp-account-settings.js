import classNames from 'classnames';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import React from 'react';
import Modal from 'react-bootstrap/Modal';
import SMTPEncryptionType from 'webserver-form-schema/constants/smtp-encryption-type';
import SMTPPort from 'webserver-form-schema/constants/smtp-port';
import i18n from '../../../i18n';
import smtpAccountSettingsValidator from '../../validations/notifications/smtp-account-settings-validator';
import Password from '../../../core/components/fields/password';
import utils from '../../../core/utils';
import PropTypes from 'prop-types';

const SMTPAccountSettings = ({isShowModal, accountSettings, onSubmitAccountSettingsForm, onHideAccountSettingsModal}) => {
  return (
    <Modal autoFocus={false} show={isShowModal} onHide={onHideAccountSettingsModal}>
      <div className="modal-header">
        <h5 className="modal-title">{i18n.t('SMTP Logon Settings')}</h5>
      </div>
      <Formik
        validate={utils.makeFormikValidator(smtpAccountSettingsValidator)}
        initialValues={accountSettings}
        onSubmit={onSubmitAccountSettingsForm}
      >
        {({errors, touched}) =>
          (
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
                    <div className="form-check">
                      <Field name="port" className="form-check-input" type="radio" id="input-port-25" value={SMTPPort['25']}/>
                      <label className="form-check-label" htmlFor="input-port-25">25</label>
                    </div>
                    <div className="form-check ml-5">
                      <Field name="port" className="form-check-input" type="radio" id="input-port-465" value={SMTPPort['465']}/>
                      <label className="form-check-label" htmlFor="input-port-465">465</label>
                    </div>
                    <div className="form-check ml-5">
                      <Field name="port" className="form-check-input" type="radio" id="input-port-587" value={SMTPPort['587']}/>
                      <label className="form-check-label" htmlFor="input-port-587">587</label>
                    </div>
                    <div className="form-check ml-5">
                      <Field name="port" className="form-check-input" type="radio" id="input-port-2525" value={SMTPPort['2525']}/>
                      <label className="form-check-label" htmlFor="input-port-2525">2525</label>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label>{i18n.t('Encryption')}</label>
                  <div className="d-flex align-items-center">
                    <div className="form-check">
                      <Field name="encryption" className="form-check-input" type="radio" id="input-encryption-none" value={SMTPEncryptionType.none}/>
                      <label className="form-check-label" htmlFor="input-encryption-none">{i18n.t('None')}</label>
                    </div>
                    <div className="form-check ml-5">
                      <Field name="encryption" className="form-check-input" type="radio" id="input-encryption-ssl" value={SMTPEncryptionType.ssl}/>
                      <label className="form-check-label" htmlFor="input-encryption-ssl">SSL</label>
                    </div>
                    <div className="form-check ml-5">
                      <Field name="encryption" className="form-check-input" type="radio" id="input-encryption-tls" value={SMTPEncryptionType.tls}/>
                      <label className="form-check-label" htmlFor="input-encryption-tls">TLS</label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer flex-column">
                <div className="form-group w-100 mx-0">
                  <button type="submit" className="btn btn-primary btn-block rounded-pill">
                    {i18n.t('Apply')}
                  </button>
                </div>
                <button type="button" className="btn btn-info btn-block m-0 rounded-pill" onClick={onHideAccountSettingsModal}>
                  {i18n.t('Close')}
                </button>
              </div>
            </Form>
          )}
      </Formik>
    </Modal>
  );
};

SMTPAccountSettings.propTypes = {
  accountSettings: PropTypes.shape({}).isRequired,
  isShowModal: PropTypes.bool.isRequired,
  onHideAccountSettingsModal: PropTypes.func.isRequired,
  onSubmitAccountSettingsForm: PropTypes.func.isRequired
};

export default SMTPAccountSettings;
