import classNames from 'classnames';
import React from 'react';
import progress from 'nprogress';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import Cookies from 'js-cookie';
import {getRouter} from 'capybara-router';
import i18n from '../../../i18n';
import Password from '../../../core/components/fields/password';
import UserSchema from 'webserver-form-schema/user-schema';
import loginValidator from '../../validations/account/login-validator';
import api from '../../../core/apis/web-api';
import utils from '../../../core/utils';
import constants from '../../../core/constants';
import AccountContainer from './account-container';
import AccountTitle from './account-title';
import withGlobalStatus from '../../withGlobalStatus';
import {useContextState} from '../../stateProvider';

const Login = () => {
  const {isApiProcessing} = useContextState();

  /**
  * Handler on user submit the login form.
  * @param {Object} values
  * @property {String} account
  * @property {String} password
  * @returns {void}
  */
  const onSubmitLoginForm = values => {
    progress.start();
    api.account.login(values)
      .then(response => {
        localStorage.setItem('$expires', response.data.expires - (constants.REDIRECT_COUNTDOWN * 1000));
        redirectPage();
      })
      .catch(error => {
        if (error.response) {
          if (error.response.status === 429) {
            if (
              error.response.data && error.response.data.extra &&
             error.response.data.extra.loginLockRemainingMs
            ) {
              getRouter().go({
                name: 'login-lock',
                params: {loginLockExpiredTime: Date.now() + error.response.data.extra.loginLockRemainingMs}
              });
              return;
            }
          }

          if (error.response.status === 400) {
            if (
              error.response.data && error.response.data.extra &&
             error.response.data.extra.loginFailedRemainingTimes >= 0
            ) {
              getRouter().go({
                name: 'login-error',
                params: {loginFailedRemainingTimes: error.response.data.extra.loginFailedRemainingTimes}
              });
            }
          }
        }
      })
      .finally(progress.done);
  };

  const redirectPage = () => {
    const redirectUri = Cookies.get(window.config.cookies.redirect);
    if (redirectUri && /^\/.*/.test(redirectUri)) {
      Cookies.set(window.config.cookies.redirect, null, {expires: -100});
      location.href = redirectUri;
    } else {
      location.href = '/';
    }
  };

  return (
    <AccountContainer page="page-login">
      <Formik
        initialValues={{
          account: '',
          password: '',
          maxAge: '3600000'
        }}
        validate={utils.makeFormikValidator(loginValidator)}
        onSubmit={onSubmitLoginForm}
      >
        {({errors, touched}) => (
          <Form className="card shadow mb-5">
            <div className="card-body">
              <AccountTitle title={i18n.t('ACCOUNT LOGIN')}/>
              <div className="form-group">
                <label>{i18n.t('Username')}</label>
                <Field
                  name="account"
                  type="text"
                  maxLength={UserSchema.account.max}
                  placeholder={i18n.t('Enter your username')}
                  className={classNames('form-control', {'is-invalid': errors.account && touched.account})}
                />
                <ErrorMessage component="div" name="account" className="invalid-feedback"/>
              </div>
              <div className="form-group has-feedback">
                <label>{i18n.t('Password')}</label>
                <Field
                  name="password"
                  component={Password}
                  inputProps={{
                    placeholder: i18n.t('Enter your password'),
                    className: classNames('form-control', {'is-invalid': errors.password && touched.password})
                  }}
                />
                <ErrorMessage component="div" name="password" className="invalid-feedback"/>
              </div>

              <button
                disabled={isApiProcessing || !utils.isObjectEmpty(errors)}
                type="submit"
                className="btn btn-primary btn-block rounded-pill mt-5"
              >
                {i18n.t('Login')}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </AccountContainer>
  );
};

export default withGlobalStatus(Login);
