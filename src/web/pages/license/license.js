const React = require('react');
const {getRouter} = require('capybara-router');
const classNames = require('classnames');
const {Formik, Form, Field} = require('formik');
const progress = require('nprogress');
const Base = require('../shared/base');
const api = require('../../../core/apis/web-api');
const {formatDate, renderError} = require('../../../core/utils');

const ACTIVATE = '已啟用';
const DEACTIVATE = '未啟用';

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
                <h3 className="mb-4">智慧授權</h3>
                <Formik initialValues={{authKey: ''}} onSubmit={this.onSubmit}>
                  <Form>
                    <div className="form-row">
                      <div className="col-auto my-1">
                        <Field
                          autoFocus
                          className="form-control"
                          name="authKey"
                          type="text"
                          placeholder="請輸入授權碼"
                          style={{width: '312px'}}
                        />
                      </div>
                      <div className="col-auto my-1">
                        <button
                          className="btn btn-primary rounded-pill px-4"
                          type="submit"
                          disabled={this.state.$isApiProcessing}
                        >
                          啟用
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
                      臉部辨識
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
                        )}/>{systemInformation.isEnableFaceRecognition ? ACTIVATE : DEACTIVATE}
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
                      性別年齡
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
                        )}/>{systemInformation.isEnableAgeGender ? ACTIVATE : DEACTIVATE}
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
                      人型偵測
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
                        )}/>{systemInformation.isEnableHumanoidDetection ? ACTIVATE : DEACTIVATE}
                      </span>
                    </div>
                  </div>
                </div>

                <table className="table custom-style">
                  <thead>
                    <tr className="shadow">
                      <th/>
                      <th>時間</th>
                      <th>啟用者</th>
                      <th>授權碼</th>
                      <th>啟用功能</th>
                      <th>狀態</th>
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
                              臉部辨識
                            </span>
                          )}
                          {authKey.isEnableAgeGender && (
                            <span className="badge badge-primary badge-pill text-size-16 px-3">
                              性別年齡
                            </span>
                          )}
                          {authKey.isEnableHumanoidDetection && (
                            <span className="badge badge-primary badge-pill text-size-16 px-3">
                              人型偵測
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
