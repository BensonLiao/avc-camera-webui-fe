const classNames = require('classnames');
const {Formik, Form, Field} = require('formik');
const {getRouter} = require('capybara-router');
const progress = require('nprogress');
const PropTypes = require('prop-types');
const React = require('react');
const Base = require('../shared/base');
const LicenseList = require('./license-list');
const LicenseStatus = require('./license-status');
const {default: i18n} = require('../../i18n');
const api = require('../../../core/apis/web-api');
const authKeyValidator = require('../../validations/auth-keys/auth-key-validator');
const AuthKeySchema = require('webserver-form-schema/auth-key-schema');
const iconFaceRecognitionEnable = require('../../../resource/face-recognition-enable-100px.svg');
const iconFaceRecognitionDisable = require('../../../resource/face-recognition-disable-100px.svg');
const iconAgeGenderEnable = require('../../../resource/age-gender-enable-100px.svg');
const iconAgeGenderDisable = require('../../../resource/age-gender-disable-100px.svg');
const iconHumanoidDetectionEnable = require('../../../resource/human-detection-enable-100px.svg');
const iconHumanoidDetectionDisable = require('../../../resource/human-detection-disable-100px.svg');
const notify = require('../../../core/notify');
const utils = require('../../../core/utils');
const {default: BreadCrumb} = require('../../../core/components/fields/breadcrumb');

module.exports = class License extends Base {
  static get propTypes() {
    return {
      authKeys: PropTypes.shape(LicenseList.propTypes.authKeys).isRequired,
      authStatus: PropTypes.shape({
        isEnableFaceRecognitionKey: PropTypes.bool.isRequired,
        isEnableAgeGenderKey: PropTypes.bool.isRequired,
        isEnableHumanoidDetectionKey: PropTypes.bool.isRequired
      }).isRequired
    };
  }

  /**
   * Handler on user submit the add auth key form.
   * Reload the router or render error page.
   * @param {String} authKey
   * @returns {void}
   */
  onSubmit = ({authKey}) => {
    const keyList = this.props.authKeys.items.map(key => key.authKey);
    const check = utils.duplicateCheck(keyList, authKey);
    if (check) {
      notify.showErrorNotification({
        title: i18n.t('Activation Failed'),
        message: i18n.t('Key Already Registered!')
      });
    }

    if (!check) {
      progress.start();
      api.authKey.addAuthKey(authKey)
        .then(response => {
          notify.showSuccessNotification({
            title: i18n.t('Activated Successfully'),
            message: i18n.t('{{0}} authorized successfully!', {
              0: (() => {
                const result = [];
                if (response.data.isEnableFaceRecognitionKey) {
                  result.push(i18n.t('Facial Recognition'));
                }

                if (response.data.isEnableAgeGenderKey) {
                  result.push(i18n.t('Age Gender'));
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

  addLicenseFormRender = ({errors, touched, submitCount}) => {
    const isSubmitted = submitCount > 0;

    return (
      <Form>
        <div className="form-row">
          <div className="col-auto my-1">
            <Field
              autoFocus
              className={classNames('form-control', {'is-invalid': errors.authKey && isSubmitted})}
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
              disabled={this.state.$isApiProcessing}
            >
              {i18n.t('Activate')}
            </button>
          </div>
        </div>
        <div className="form-row">
          <div className="col-auto">
            {
              errors.authKey && touched.authKey && isSubmitted && (
                <div className="invalid-feedback d-block mt-0">{errors.authKey}</div>
              )
            }
          </div>
        </div>
      </Form>
    );
  };

  render() {
    const {
      authStatus: {
        isEnableFaceRecognitionKey,
        isEnableAgeGenderKey,
        isEnableHumanoidDetectionKey
      }, authKeys
    } = this.props;
    return (
      <div className="bg-white">
        <div className="page-license bg-gray" style={{height: '522px'}}>
          <div className="container-fluid">
            <div className="row">
              <BreadCrumb
                path={[i18n.t('Analytic'), i18n.t('License')]}
                routes={['/analytic/face-recognition']}
              />
              <div className="col-12">
                <h3 className="mb-4">{i18n.t('License')}</h3>
                <Formik
                  initialValues={{authKey: ''}}
                  validate={utils.makeFormikValidator(authKeyValidator)}
                  onSubmit={this.onSubmit}
                >
                  {this.addLicenseFormRender}
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
                    licenseKeyStatus={isEnableFaceRecognitionKey}
                    licenseEnableImg={iconFaceRecognitionEnable}
                    licenseDisableImg={iconFaceRecognitionDisable}
                  />
                  <LicenseStatus
                    licenseName={i18n.t('Age Gender')}
                    licenseKeyStatus={isEnableAgeGenderKey}
                    licenseEnableImg={iconAgeGenderEnable}
                    licenseDisableImg={iconAgeGenderDisable}
                  />
                  <LicenseStatus
                    licenseName={i18n.t('Human Detection')}
                    licenseKeyStatus={isEnableHumanoidDetectionKey}
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
  }
};
