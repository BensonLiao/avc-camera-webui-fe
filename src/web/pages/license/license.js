const React = require('react');
const {getRouter} = require('capybara-router');
const classNames = require('classnames');
const {Formik, Form, Field} = require('formik');
const progress = require('nprogress');
const Base = require('../shared/base');
const _ = require('../../../languages');
const api = require('../../../core/apis/web-api');
const {formatDate, renderError} = require('../../../core/utils');

const ACTIVATED = _('Activated');
const NOT_ACTIVATED = _('Not activated');

module.exports = class License extends Base {
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
  }

  render() {
    const {systemInformation, authKeys} = this.props;
    return (
      <div className="main-content bg-white">
        <div className="page-license bg-gray" style={{height: '522px'}}>
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <h3 className="mb-4">{_('License')}</h3>
                <Formik initialValues={{authKey: ''}} onSubmit={this.onSubmit}>
                  <Form>
                    <div className="form-row">
                      <div className="col-auto my-1">
                        <Field
                          autoFocus
                          className="form-control"
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
                      <img src="/resource/face-recognition-enable.svg"/>
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
                      <img src="/resource/age-gender-disable.svg"/>
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
                      <img src="/resource/humanoid-detection-disable.svg"/>
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
                      <th>{_('Activated Functions')}</th>
                      <th>{_('Status')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {authKeys.items.map((authKey, index) => (
                      <tr key={authKey.id}>
                        <td className={classNames({'border-bottom': index < authKeys.items.length - 1})}>
                          {authKey.id}
                        </td>
                        <td className={classNames({'border-bottom': index < authKeys.items.length - 1})}>
                          {formatDate(authKey.time)}
                        </td>
                        <td className={classNames({'border-bottom': index < authKeys.items.length - 1})}>
                          {authKey.userName}
                        </td>
                        <td className={classNames({'border-bottom': index < authKeys.items.length - 1})}>
                          {authKey.authKey}
                        </td>
                        <td className={classNames({'border-bottom': index < authKeys.items.length - 1})}>
                          {authKey.isEnableFaceRecognition && (
                            <span className="badge badge-primary badge-pill text-size-16 px-3">
                              {_('Face recognition')}
                            </span>
                          )}
                          {authKey.isEnableAgeGender && (
                            <span className="badge badge-primary badge-pill text-size-16 px-3">
                              {_('Age gender')}
                            </span>
                          )}
                          {authKey.isEnableHumanoidDetection && (
                            <span className="badge badge-primary badge-pill text-size-16 px-3">
                              {_('Humanoid detection')}
                            </span>
                          )}
                        </td>
                        <td className={classNames({'border-bottom': index < authKeys.items.length - 1})}>
                          {Boolean(authKey.status) && (
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
