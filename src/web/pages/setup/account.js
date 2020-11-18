import classNames from 'classnames';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import progress from 'nprogress';
import React from 'react';
import UserPermission from 'webserver-form-schema/constants/user-permission';
import UserSchema from 'webserver-form-schema/user-schema';
import api from '../../../core/apis/web-api';
import i18n from '../../../i18n';
import logo from '../../../resource/logo-avc-secondary.svg';
import Password from '../../../core/components/fields/password';
import ProgressBar from './progress-bar';
import setupAccountValidator from '../../validations/setup/account-validator';
import setupStep02 from '../../../resource/setup-step-02.png';
import store from '../../../core/store';
import {useContextState} from '../../stateProvider';
import utils from '../../../core/utils';
import withGlobalStatus from '../../withGlobalStatus';

const SetupAccount = () => {
  const {isApiProcessing} = useContextState();

  /**
   * @param {Object} values
   * @returns {void}
   */
  const onSubmitSetupForm = values => {
    const $setup = store.get('$setup');

    progress.start();
    api.system.setup({
      language: $setup.language,
      account: {
        account: values.account,
        password: values.password
      }
    })
      .then(() => {
        location.href = '/';
      })
      .finally(progress.done);
  };

  const initialValue = store.get('$setup').account;

  return (
    <div className="page-setup-account bg-secondary">
      <div className="navbar primary">
        { !window.isNoBrand &&
        <img src={logo}/>}
      </div>
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-card">
            <Formik
              initialValues={initialValue}
              validate={setupAccountValidator}
              onSubmit={onSubmitSetupForm}
            >
              {({errors, touched}) => {
                const classTable = {
                  account: classNames(
                    'form-control', {'is-invalid': errors.account && touched.account}
                  ),
                  password: classNames(
                    'form-control', {'is-invalid': errors.password && touched.password}
                  ),
                  confirmPassword: classNames(
                    'form-control', {'is-invalid': errors.confirmPassword && touched.confirmPassword}
                  )
                };
                return (
                  <Form className="card shadow mb-5">
                    <div className="card-body">
                      <ProgressBar
                        step={2}
                        progressBarImage={setupStep02}
                      />

                      <div className="form-group">
                        <label>{i18n.t('Permission')}</label>
                        <div className="select-wrapper border rounded-pill overflow-hidden px-2">
                          <Field component="select" name="permission" className="form-control border-0">
                            <option value={UserPermission.root}>{i18n.t(`permission-${UserPermission.root}`)}</option>
                          </Field>
                        </div>
                      </div>
                      <div className="form-group">
                        <label>{i18n.t('Account')}</label>
                        <Field autoFocus name="account" maxLength={UserSchema.account.max} type="text" className={classTable.account} placeholder={i18n.t('Enter a name for this account')}/>
                        <ErrorMessage component="div" name="account" className="invalid-feedback"/>
                        <small className="text-info">
                          {i18n.t('1-32 characters: letters, numbers and symbols excluding #, %, &, `, ", \\, <, > and space')}
                        </small>
                      </div>
                      <div className="form-group has-feedback">
                        <label>{i18n.t('Password')}</label>
                        <Field
                          name="password"
                          component={Password}
                          inputProps={{
                            placeholder: i18n.t('Enter a password'),
                            className: classTable.password
                          }}
                        />
                        <ErrorMessage component="div" name="password" className="invalid-feedback"/>
                        <small className="text-info">
                          {i18n.t('8-16 characters: at least one uppercase and lowercase letter, number, and symbol excluding #, %, &, `, ", \\, <, > and space')}
                        </small>
                      </div>
                      <div className="form-group has-feedback">
                        <label>{i18n.t('Confirm Password')}</label>
                        <Field
                          name="confirmPassword"
                          component={Password}
                          inputProps={{
                            placeholder: i18n.t('Enter the password again'),
                            className: classTable.confirmPassword
                          }}
                        />
                        <ErrorMessage component="div" name="confirmPassword" className="invalid-feedback"/>
                      </div>

                      <button disabled={isApiProcessing || !utils.isObjectEmpty(errors)} type="submit" className="btn btn-primary btn-block rounded-pill">
                        {i18n.t('Done')}
                      </button>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withGlobalStatus(SetupAccount);
