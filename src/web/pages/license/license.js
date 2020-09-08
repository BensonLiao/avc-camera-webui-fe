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
      authKeys: PropTypes.shape({
        items: PropTypes.arrayOf(PropTypes.shape({
          time: PropTypes.string.isRequired,
          user: PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired
          }).isRequired,
          authKey: PropTypes.string.isRequired,
          isEnableFaceRecognitionKey: PropTypes.bool.isRequired,
          isEnableAgeGenderKey: PropTypes.bool.isRequired,
          isEnableHumanoidDetectionKey: PropTypes.bool.isRequired,
          isEnable: PropTypes.bool.isRequired
        }).isRequired).isRequired
      }).isRequired,
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
      utils.showErrorNotification({
        title: _('Activation Failed'),
        message: _('Key already registered!')
      });
    }

    if (!check) {
      progress.start();
      api.authKey.addAuthKey(authKey)
        .then(response => {
          utils.showSuccessNotification({
            title: _('Activated Successfully'),
            message: _('{0} authorized successfully!', [
              (() => {
                const result = [];
                if (response.data.isEnableFaceRecognitionKey) {
                  result.push(_('Facial Recognition'));
                }

                if (response.data.isEnableAgeGenderKey) {
                  result.push(_('Age Gender'));
                }

                if (response.data.isEnableHumanoidDetectionKey) {
                  result.push(_('Human Detection'));
                }

                return result.join(', ');
              })()
            ])
          });
          getRouter().reload();
        })
        .catch(() => {
          utils.showErrorNotification({
            title: _('Activation Failed'),
            message: _('Authorization failed!')
          });
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
              placeholder={_('Enter your authentication key')}
              style={{width: '312px'}}
            />
            {
              errors.authKey && touched.authKey && (
                <div className="invalid-feedback">{errors.authKey}</div>
              )
            }
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
    const {authStatus: {
      isEnableFaceRecognitionKey,
      isEnableAgeGenderKey,
      isEnableHumanoidDetectionKey
    }, authKeys} = this.props;
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
                  validate={authKeyValidator}
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
                    {'active shadow border-success': isEnableFaceRecognitionKey}
                  )}
                  >
                    <div className="img-wrapper">
                      <img src={isEnableFaceRecognitionKey ? iconFaceRecognitionEnable :
                        iconFaceRecognitionDisable}/>
                    </div>
                    <h4 className={classNames(
                      'text-size-20 mt-3',
                      isEnableFaceRecognitionKey ?
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
                        isEnableFaceRecognitionKey ?
                          'border-success text-success' :
                          'border-danger text-danger'
                      )}
                      >
                        <i className={classNames(
                          'fas',
                          isEnableFaceRecognitionKey ?
                            'fa-check-circle' :
                            'fa-minus-circle'
                        )}/>
                        {isEnableFaceRecognitionKey ? _('Activated') : _('Inactivated')}
                      </span>
                    </div>
                  </div>

                  <div className={classNames(
                    'border text-center bg-white',
                    {'active shadow border-success': isEnableAgeGenderKey}
                  )}
                  >
                    <div className="img-wrapper">
                      <img src={isEnableAgeGenderKey ? iconAgeGenderEnable :
                        iconAgeGenderDisable}/>
                    </div>
                    <h4 className={classNames(
                      'text-size-20 mt-3',
                      isEnableAgeGenderKey ?
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
                        isEnableAgeGenderKey ?
                          'border-success text-success' :
                          'border-danger text-danger'
                      )}
                      >
                        <i className={classNames(
                          'fas',
                          isEnableAgeGenderKey ?
                            'fa-check-circle' :
                            'fa-minus-circle'
                        )}/>
                        {isEnableAgeGenderKey ? _('Activated') : _('Inactivated')}
                      </span>
                    </div>
                  </div>

                  <div className={classNames(
                    'border text-center bg-white',
                    {'active shadow border-success': isEnableHumanoidDetectionKey}
                  )}
                  >
                    <div className="img-wrapper">
                      <img src={isEnableHumanoidDetectionKey ? iconHumanoidDetectionEnable :
                        iconHumanoidDetectionDisable}/>
                    </div>
                    <h4 className={classNames(
                      'text-size-20 mt-3',
                      isEnableHumanoidDetectionKey ?
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
                        isEnableHumanoidDetectionKey ?
                          'border-success text-success' :
                          'border-danger text-danger'
                      )}
                      >
                        <i className={classNames(
                          'fas',
                          isEnableHumanoidDetectionKey ?
                            'fa-check-circle' :
                            'fa-minus-circle'
                        )}/>
                        {isEnableHumanoidDetectionKey ? _('Activated') : _('Inactivated')}
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
                          {authKey.isEnableFaceRecognitionKey && (
                            <span className="badge badge-primary badge-pill">
                              {_('Facial Recognition')}
                            </span>
                          )}
                          {authKey.isEnableAgeGenderKey && (
                            <span className="badge badge-primary badge-pill ml-1">
                              {_('Age Gender')}
                            </span>
                          )}
                          {authKey.isEnableHumanoidDetectionKey && (
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
