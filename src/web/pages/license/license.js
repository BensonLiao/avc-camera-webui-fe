const React = require('react');
const {getRouter} = require('capybara-router');
const Base = require('../shared/base');

module.exports = class License extends Base {
  constructor(props) {
    super(props);
    this.currentRoute = getRouter().findRouteByName('web.license');
  }

  render() {
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
                  <div className="border border-success text-center bg-white active shadow">
                    <div className="img-wrapper">
                      <img src="/resource/face-recognition-enable.svg"/>
                    </div>
                    <h4 className="text-size-20 text-primary mt-3">臉部辨識</h4>
                    <div className="bottom">
                      <hr/>
                      <span className="border border-success rounded-pill text-success p-1 pr-2">
                        <i className="fas fa-check-circle"/>未啟用
                      </span>
                    </div>
                  </div>

                  <div className="border text-center bg-white">
                    <div className="img-wrapper">
                      <img src="/resource/age-gender-disable.svg"/>
                    </div>
                    <h4 className="text-size-20 text-muted mt-3">性別年齡</h4>
                    <div className="bottom">
                      <hr/>
                      <span className="border border-danger rounded-pill text-danger p-1 pr-2">
                        <i className="fas fa-minus-circle"/>未啟用
                      </span>
                    </div>
                  </div>

                  <div className="border text-center bg-white">
                    <div className="img-wrapper">
                      <img src="/resource/humanoid-detection-disable.svg"/>
                    </div>
                    <h4 className="text-size-20 text-muted mt-3">人型偵測</h4>
                    <div className="bottom">
                      <hr/>
                      <span className="border border-danger rounded-pill text-danger p-1 pr-2">
                        <i className="fas fa-minus-circle"/>未啟用
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
