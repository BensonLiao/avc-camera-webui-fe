const React = require('react');
const PropTypes = require('prop-types');
const {Link, getRouter} = require('capybara-router');
const classNames = require('classnames');
const {Formik, Form, Field} = require('formik');
const progress = require('nprogress');
const Base = require('../shared/base');
const _ = require('../../../languages');
const api = require('../../../core/apis/web-api');
const authKeyValidator = require('../../validations/auth-keys/auth-key-validator');
const utils = require('../../../core/utils');
const iconFaceRecognitionEnable =
  require('../../../resource/face-recognition-enable-100px.svg');
const iconFaceRecognitionDisable =
  require('../../../resource/face-recognition-disable-100px.svg');
const iconAgeGenderEnable =
  require('../../../resource/age-gender-enable-100px.svg');
const iconAgeGenderDisable =
  require('../../../resource/age-gender-disable-100px.svg');
const iconHumanoidDetectionEnable =
  require('../../../resource/human-detection-enable-100px.svg');
const iconHumanoidDetectionDisable =
  require('../../../resource/human-detection-disable-100px.svg');

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
      .then(response => {
        utils.showSuccessNotification(
          _('Activated Successfully'),
          _('{0} authorized successfully!', [
            (() => {
              const result = [];
              if (response.data.isEnableFaceRecognition) {
                result.push(_('Facial Recognition'));
              }

              if (response.data.isEnableAgeGender) {
                result.push(_('Age Gender'));
              }

              if (response.data.isEnableHumanoidDetection) {
                result.push(_('Human Detection'));
              }

              return result.join(', ');
            })()
          ])
        );
        getRouter().reload();
      })
      .catch(() => {
        progress.done();
        utils.showErrorNotification(_('Activation Failed'), _('Authorization failed!'));
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
              placeholder={_('Enter your authentication key')}
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
      <div className="bg-white">
        <div className="page-license bg-gray" style={{height: '522px'}}>
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <nav>
                  <ol className="breadcrumb rounded-pill">
                    <li className="breadcrumb-item active">
                      <Link to="/analytic/face-recognition">{_('Analytic')}</Link>
                    </li>
                    <li className="breadcrumb-item">{_('License')}</li>
                  </ol>
                </nav>
              </div>
              <div className="col-12">
                <h3 className="mb-4">{_('License')}</h3>
                <Formik initialValues={{authKey: ''}}
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
                      {_('Facial Recognition')}
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
                        )}/>
                        {systemInformation.isEnableFaceRecognition ? _('Activated') : _('Inactivated')}
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
                      {_('Age Gender')}
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
                        )}/>
                        {systemInformation.isEnableAgeGender ? _('Activated') : _('Inactivated')}
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
                      {_('Human Detection')}
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
                        )}/>
                        {systemInformation.isEnableHumanoidDetection ? _('Activated') : _('Inactivated')}
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
                      <th>{_('Activate Functions')}</th>
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
                          {utils.formatDate(authKey.time)}
                        </td>
                        <td>
                          {authKey.user.name}
                        </td>
                        <td>
                          {authKey.authKey}
                        </td>
                        <td>
                          {authKey.isEnableFaceRecognition && (
                            <span className="badge badge-primary badge-pill">
                              {_('Facial Recognition')}
                            </span>
                          )}
                          {authKey.isEnableAgeGender && (
                            <span className="badge badge-primary badge-pill ml-1">
                              {_('Age Gender')}
                            </span>
                          )}
                          {authKey.isEnableHumanoidDetection && (
                            <span className="badge badge-primary badge-pill ml-1">
                              {_('Human Detection')}
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
