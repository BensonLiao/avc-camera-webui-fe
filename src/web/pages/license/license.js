const React = require('react');
const PropTypes = require('prop-types');
const {getRouter} = require('capybara-router');
const classNames = require('classnames');
const {Formik, Form, Field} = require('formik');
const progress = require('nprogress');
const Base = require('../shared/base');
const _ = require('../../../languages');
const api = require('../../../core/apis/web-api');
const authKeyValidator = require('../../validations/auth-keys/auth-key-validator');
const {formatDate, renderError, makeFormikValidator} = require('../../../core/utils');
const iconFaceRecognitionEnable =
  require('webserver-prototype/src/resource/face-recognition-enable.svg');
const iconFaceRecognitionDisable =
  require('webserver-prototype/src/resource/face-recognition-disable.svg');
const iconAgeGenderEnable =
  require('webserver-prototype/src/resource/age-gender-enable.svg');
const iconAgeGenderDisable =
  require('webserver-prototype/src/resource/age-gender-disable.svg');
const iconHumanoidDetectionEnable =
  require('webserver-prototype/src/resource/humanoid-detection-enable.svg');
const iconHumanoidDetectionDisable =
  require('webserver-prototype/src/resource/humanoid-detection-disable.svg');

const ACTIVATED = _('Activated');
const NOT_ACTIVATED = _('Not activated');

module.exports = class License extends Base {
  static get propTypes() {
    return {
      systemInformation: PropTypes.shape({
        isEnableFaceRecognition: PropTypes.bool.isRequired,
        isEnableAgeGender: PropTypes.bool.isRequired,
        isEnableHumanoidDetection: PropTypes.bool.isRequired
      }).isRequired,
      authKeys: PropTypes.shape({
        items: PropTypes.arrayOf(PropTypes.shape({
          time: PropTypes.string.isRequired,
          user: PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired
          }).isRequired,
          authKey: PropTypes.string.isRequired,
          isEnableFaceRecognition: PropTypes.bool.isRequired,
          isEnableAgeGender: PropTypes.bool.isRequired,
          isEnableHumanoidDetection: PropTypes.bool.isRequired,
          isEnable: PropTypes.bool.isRequired
        }).isRequired).isRequired
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
    progress.start();
    api.authKey.addAuthKey(authKey)
      .then(() => {
        getRouter().reload();
      })
      .catch(error => {
        progress.done();
        renderError(error);
      });
  };

  addLicenseFormRender = ({errors, submitCount}) => {
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
              placeholder={_('Please enter the authentication key.')}
              style={{width: '312px'}}
            />
          </div>
          <div className="col-auto my-1">
            <button
              className="btn btn-primary rounded-pill px-4"
              type="submit"
              disabled={this.state.$isApiProcessing}
            >
              {_('Activate')}
            </button>
          </div>
        </div>
      </Form>
    );
  };

  render() {
    const {systemInformation, authKeys} = this.props;
    return (
      <div className="main-content bg-white">
        <div className="page-license bg-gray" style={{height: '522px'}}>
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <h3 className="mb-4">{_('License')}</h3>
                <Formik initialValues={{authKey: ''}}
                  validate={makeFormikValidator(authKeyValidator)}
                  onSubmit={this.onSubmit}
                >
                  {this.addLicenseFormRender}
                </Formik>
              </div>
            </div>
          </div>
        </div>

        <div className="page-license pt-0">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="status d-flex">
                  <div className={classNames(
                    'border text-center bg-white',
                    {'active shadow border-success': systemInformation.isEnableFaceRecognition}
                  )}
                  >
                    <div className="img-wrapper">
                      <img src={systemInformation.isEnableFaceRecognition ? iconFaceRecognitionEnable :
                        iconFaceRecognitionDisable}/>
                    </div>
                    <h4 className={classNames(
                      'text-size-20 mt-3',
                      systemInformation.isEnableFaceRecognition ?
                        'text-primary' :
                        'text-muted'
                    )}
                    >
                      {_('Face recognition')}
                    </h4>
                    <div className="bottom">
                      <hr/>
                      <span className={classNames(
                        'border rounded-pill p-1 pr-2',
                        systemInformation.isEnableFaceRecognition ?
                          'border-success text-success' :
                          'border-danger text-danger'
                      )}
                      >
                        <i className={classNames(
                          'fas',
                          systemInformation.isEnableFaceRecognition ?
                            'fa-check-circle' :
                            'fa-minus-circle'
                        )}/>{systemInformation.isEnableFaceRecognition ? ACTIVATED : NOT_ACTIVATED}
                      </span>
                    </div>
                  </div>

                  <div className={classNames(
                    'border text-center bg-white',
                    {'active shadow border-success': systemInformation.isEnableAgeGender}
                  )}
                  >
                    <div className="img-wrapper">
                      <img src={systemInformation.isEnableAgeGender ? iconAgeGenderEnable :
                        iconAgeGenderDisable}/>
                    </div>
                    <h4 className={classNames(
                      'text-size-20 mt-3',
                      systemInformation.isEnableAgeGender ?
                        'text-primary' :
                        'text-muted'
                    )}
                    >
                      {_('Age gender')}
                    </h4>
                    <div className="bottom">
                      <hr/>
                      <span className={classNames(
                        'border rounded-pill p-1 pr-2',
                        systemInformation.isEnableAgeGender ?
                          'border-success text-success' :
                          'border-danger text-danger'
                      )}
                      >
                        <i className={classNames(
                          'fas',
                          systemInformation.isEnableAgeGender ?
                            'fa-check-circle' :
                            'fa-minus-circle'
                        )}/>{systemInformation.isEnableAgeGender ? ACTIVATED : NOT_ACTIVATED}
                      </span>
                    </div>
                  </div>

                  <div className={classNames(
                    'border text-center bg-white',
                    {'active shadow border-success': systemInformation.isEnableHumanoidDetection}
                  )}
                  >
                    <div className="img-wrapper">
                      <img src={systemInformation.isEnableHumanoidDetection ? iconHumanoidDetectionEnable :
                        iconHumanoidDetectionDisable}/>
                    </div>
                    <h4 className={classNames(
                      'text-size-20 mt-3',
                      systemInformation.isEnableHumanoidDetection ?
                        'text-primary' :
                        'text-muted'
                    )}
                    >
                      {_('Humanoid detection')}
                    </h4>
                    <div className="bottom">
                      <hr/>
                      <span className={classNames(
                        'border rounded-pill p-1 pr-2',
                        systemInformation.isEnableHumanoidDetection ?
                          'border-success text-success' :
                          'border-danger text-danger'
                      )}
                      >
                        <i className={classNames(
                          'fas',
                          systemInformation.isEnableHumanoidDetection ?
                            'fa-check-circle' :
                            'fa-minus-circle'
                        )}/>{systemInformation.isEnableHumanoidDetection ? ACTIVATED : NOT_ACTIVATED}
                      </span>
                    </div>
                  </div>
                </div>

                <table className="table custom-style">
                  <thead>
                    <tr className="shadow">
                      <th/>
                      <th>{_('Time')}</th>
                      <th>{_('Activate User')}</th>
                      <th>{_('Authentication Key')}</th>
                      <th>{_('Enabled Functions')}</th>
                      <th>{_('Enable Status')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {authKeys.items.map((authKey, index) => (
                      <tr key={authKey.time}>
                        <td>
                          {index + 1}
                        </td>
                        <td>
                          {formatDate(authKey.time)}
                        </td>
                        <td>
                          {authKey.user.name}
                        </td>
                        <td>
                          {authKey.authKey}
                        </td>
                        <td>
                          {authKey.isEnableFaceRecognition && (
                            <span className="badge badge-primary badge-pill text-size-16 px-3">
                              {_('Face recognition')}
                            </span>
                          )}
                          {authKey.isEnableAgeGender && (
                            <span className="badge badge-primary badge-pill text-size-16 px-3 ml-1">
                              {_('Age gender')}
                            </span>
                          )}
                          {authKey.isEnableHumanoidDetection && (
                            <span className="badge badge-primary badge-pill text-size-16 px-3 ml-1">
                              {_('Humanoid detection')}
                            </span>
                          )}
                        </td>
                        <td>
                          {authKey.isEnable && (
                            <i className="fas fa-check-circle fa-lg fa-fw text-success"/>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
