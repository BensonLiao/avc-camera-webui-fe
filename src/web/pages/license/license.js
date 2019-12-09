const React = require('react');
const {getRouter} = require('capybara-router');
const classNames = require('classnames');
const Base = require('../shared/base');

const ACTIVATE = '已啟用';
const DEACTIVATE = '未啟用';

module.exports = class License extends Base {
  constructor(props) {
    super(props);
    this.currentRoute = getRouter().findRouteByName('web.license');
  }

  render() {
    const {systemInformation} = this.props;
    return (
      <div className="main-content bg-white">
        <div className="page-license bg-gray" style={{height: '522px'}}>
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <h3 className="mb-4">智慧授權</h3>
                <form className="form-row">
                  <div className="col-auto my-1">
                    <input autoFocus className="form-control" type="text" placeholder="請輸入授權碼" style={{width: '312px'}}/>
                  </div>
                  <div className="col-auto my-1">
                    <button className="btn btn-primary rounded-pill px-4" type="submit">啟用</button>
                  </div>
                </form>
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
                    <tr>
                      <td>1</td>
                      <td>2019/03/22 08:05</td>
                      <td>ChiChi</td>
                      <td>GVHBNJLKBHVYIUON:KJLBNK</td>
                      <td>
                        <span className="badge badge-primary badge-pill text-size-16 px-3">臉部辨識</span>
                        <span className="badge badge-primary badge-pill text-size-16 px-3">性別年齡</span>
                      </td>
                      <td>
                        <i className="fas fa-check-circle fa-lg fa-fw text-success"/>
                      </td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>2019/03/22 08:06</td>
                      <td>Ben</td>
                      <td>VGHBJNKBIVHBKJLNK:MPOIBJ</td>
                      <td>
                        <span className="badge badge-primary badge-pill text-size-16 px-3">人形偵測</span>
                      </td>
                      <td>
                        <i className="fas fa-check-circle fa-lg fa-fw text-success"/>
                      </td>
                    </tr>
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
