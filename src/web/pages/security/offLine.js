const React = require('react');
const Base = require('../shared/base');

module.exports = class OffLine extends Base {
  render() {
    return (
      <div className="main-content left-menu-active">
        <div className="page-security">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <nav>
                  <ol className="breadcrumb rounded-pill">
                    <li className="breadcrumb-item active"><a href="/security/account.html">安全性</a></li>
                    <li className="breadcrumb-item">斷線錄影</li>
                  </ol>
                </nav>
              </div>

              <div className="col-center">
                <div className="card shadow">
                  <div className="card-header">斷線錄影</div>
                  <form className="card-body">
                    <div className="card form-group">
                      <div className="card-body">
                        <div className="form-group d-flex justify-content-between align-items-center mb-0">
                          <label className="font-weight-normal mb-0">裝置的日期與時間</label>
                          <label className="font-weight-normal mb-0 text-size-16">3543 MB</label>
                        </div>
                      </div>
                    </div>
                    <div className="form-group d-flex justify-content-between align-items-center">
                      <label className="mb-0">斷線錄影</label>
                      <div className="custom-control custom-switch">
                        <input type="checkbox" className="custom-control-input" id="switch-off-line-record"/>
                        <label className="custom-control-label" htmlFor="switch-off-line-record">
                          <span>開</span>
                          <span>關</span>
                        </label>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>錄影時間間隔(分)</label>
                      <div className="select-wrapper border rounded-pill overflow-hidden">
                        <select className="form-control border-0">
                          <option>1</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group d-flex justify-content-between align-items-center">
                      <label className="mb-0">上傳影像至 FTP 伺服器</label>
                      <div className="custom-control custom-switch">
                        <input type="checkbox" className="custom-control-input" id="switch-ftp"/>
                        <label className="custom-control-label" htmlFor="switch-ftp">
                          <span>開</span>
                          <span>關</span>
                        </label>
                      </div>
                    </div>
                    <div className="form-group d-flex justify-content-between align-items-center">
                      <label className="mb-0">FTP 設定</label>
                      <button className="btn btn-outline-primary rounded-pill px-4" type="button" data-toggle="modal" data-target="#modal-ftp-settings">
                        設定
                      </button>
                    </div>
                    <button type="submit" className="btn btn-block btn-primary rounded-pill">套用</button>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <div className="modal fade" id="modal-ftp-settings" tabIndex="-1">
            <div className="modal-dialog">
              <form className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">FTP 設定</h5>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label>伺服器位址</label>
                    <input type="text" className="form-control" placeholder="請輸入 IP 位址"/>
                  </div>
                  <div className="form-group">
                    <label>伺服器連接埠</label>
                    <input type="text" className="form-control" placeholder="請輸入您的密碼"/>
                  </div>
                  <div className="form-group">
                    <label>帳號</label>
                    <input type="text" className="form-control" placeholder="請輸入您的帳號"/>
                  </div>
                  <div className="form-group has-feedback">
                    <label>密碼</label>
                    <input type="password" className="form-control" placeholder="請輸入您的密碼"/>
                    <a href="#" className="form-control-feedback text-muted"><i className="fas fa-eye"/></a>
                  </div>
                  <div className="form-group">
                    <label>遠端目錄</label>
                    <input type="text" className="form-control" placeholder="請輸入您的遠端目錄"/>
                  </div>
                </div>
                <div className="modal-footer flex-column">
                  <div className="form-group w-100 mx-0">
                    <button type="submit" className="btn btn-primary btn-block rounded-pill">套用</button>
                  </div>
                  <button type="button" className="btn btn-secondary btn-block m-0 rounded-pill" data-dismiss="modal">關閉</button>
                </div>
              </form>
            </div>
          </div>
        </div>

      </div>
    );
  }
};
