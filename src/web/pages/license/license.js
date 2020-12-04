import classNames from 'classnames';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import {getRouter} from '@benson.liao/capybara-router';
import progress from 'nprogress';
import PropTypes from 'prop-types';
import React from 'react';
import i18n from '../../../i18n';
import api from '../../../core/apis/web-api';
import authKeyValidator from '../../validations/auth-keys/auth-key-validator';
import AuthKeySchema from 'webserver-form-schema/auth-key-schema';
import iconFaceRecognitionEnable from '../../../resource/face-recognition-enable-100px.svg';
import iconFaceRecognitionDisable from '../../../resource/face-recognition-disable-100px.svg';
import iconAgeGenderEnable from '../../../resource/age-gender-enable-100px.svg';
import iconAgeGenderDisable from '../../../resource/age-gender-disable-100px.svg';
import iconHumanoidDetectionEnable from '../../../resource/human-detection-enable-100px.svg';
import iconHumanoidDetectionDisable from '../../../resource/human-detection-disable-100px.svg';
import notify from '../../../core/notify';
import utils from '../../../core/utils';
import BreadCrumb from '../../../core/components/fields/breadcrumb';
import LicenseList from './license-list';
import LicenseStatus from './license-status';
import withGlobalStatus from '../../withGlobalStatus';
import {useContextState} from '../../stateProvider';

const License = ({
  authStatus: {
    isEnableFaceRecognitionKey,
    isEnableAgeGenderKey,
    isEnableHumanoidDetectionKey
  }, authKeys
}) => {
  const {isApiProcessing} = useContextState();
  /**
   * Handler on user submit the add auth key form.
   * Reload the router or render error page.
   * @param {String} authKey
   * @returns {void}
   */
  const onSubmit = ({authKey}) => {
    const keyList = authKeys.items.map(key => key.authKey);
    const check = utils.duplicateCheck(keyList, authKey);
    if (check) {
      notify.showErrorNotification({
        title: i18n.t('Activation Failed'),
        message: i18n.t('Key Already Registered')
      });
    }

    if (!check) {
      progress.start();
      api.authKey.addAuthKey(authKey)
        .then(response => {
          notify.showSuccessNotification({
            title: i18n.t('Activated Success'),
            message: i18n.t('{{0}} authorized successfully!', {
              0: (() => {
                const result = [];
                if (response.data.isEnableFaceRecognitionKey) {
                  result.push(i18n.t('Facial Recognition'));
                }

                if (response.data.isEnableAgeGenderKey) {
                  result.push(i18n.t('Age & Gender'));
                }

                if (response.data.isEnableHumanoidDetectionKey) {
                  result.push(i18n.t('Human Detection'));
                }

                return result.join(', ');
              })()
            })
          });
          getRouter().reload();
        })
        .finally(progress.done);
    }
  };

  return (
    <div className="bg-white">
      <div className="page-license bg-gray" style={{height: '522px'}}>
        <div className="container-fluid">
          <div className="row">
            <BreadCrumb
              path={[i18n.t('Analytics Settings'), i18n.t('License')]}
              routes={['/analytic/face-recognition']}
            />
            <div className="col-12">
              <h3 className="mb-4">{i18n.t('License')}</h3>
              <Formik
                initialValues={{authKey: ''}}
                validateOnBlur={false}
                validate={authKeyValidator}
                onSubmit={onSubmit}
              >
                {({errors}) => {
                  return (
                    <Form>
                      <div className="form-row">
                        <div className="col-auto my-1">
                          <Field
                            className={classNames('form-control', {'is-invalid': errors.authKey})}
                            name="authKey"
                            type="text"
                            maxLength={AuthKeySchema.authKey.max}
                            placeholder={i18n.t('Enter your authentication key')}
                            style={{width: '312px'}}
                          />
                        </div>
                        <div className="col-auto my-1">
                          <button
                            className="btn btn-primary rounded-pill px-4"
                            type="submit"
                            disabled={isApiProcessing}
                          >
                            {i18n.t('Activate')}
                          </button>
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="col-auto">
                          <ErrorMessage component="div" name="authKey" className="invalid-feedback d-block mt-0"/>
                        </div>
                      </div>
                    </Form>
                  );
                }}
              </Formik>
            </div>
          </div>
        </div>
      </div>

      <div className="page-license pt-0 page-bottom">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="status d-flex">
                <LicenseStatus
                  licenseName={i18n.t('Facial Recognition')}
                  isEnabled={isEnableFaceRecognitionKey}
                  licenseEnableImg={iconFaceRecognitionEnable}
                  licenseDisableImg={iconFaceRecognitionDisable}
                />
                <LicenseStatus
                  licenseName={i18n.t('Age & Gender')}
                  isEnabled={isEnableAgeGenderKey}
                  licenseEnableImg={iconAgeGenderEnable}
                  licenseDisableImg={iconAgeGenderDisable}
                />
                <LicenseStatus
                  licenseName={i18n.t('Human Detection')}
                  isEnabled={isEnableHumanoidDetectionKey}
                  licenseEnableImg={iconHumanoidDetectionEnable}
                  licenseDisableImg={iconHumanoidDetectionDisable}
                />
              </div>
              <LicenseList
                authKeys={authKeys}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

License.propTypes = {
  authKeys: PropTypes.shape(LicenseList.propTypes.authKeys).isRequired,
  authStatus: PropTypes.shape({
    isEnableFaceRecognitionKey: PropTypes.bool.isRequired,
    isEnableAgeGenderKey: PropTypes.bool.isRequired,
    isEnableHumanoidDetectionKey: PropTypes.bool.isRequired
  }).isRequired
};

export default withGlobalStatus(License);
