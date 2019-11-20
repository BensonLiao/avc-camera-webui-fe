const React = require('react');
const Base = require('../shared/base');

module.exports = class Https extends Base {
  render() {
    const users = this.props.users.items;
    console.log('users', users);
    return (
      <div className="main-content left-menu-active">
        <div className="page-security">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <nav>
                  <ol className="breadcrumb rounded-pill">
                    <li className="breadcrumb-item active"><a href="/security/account.html">安全性</a></li>
                    <li className="breadcrumb-item">HTTPS</li>
                  </ol>
                </nav>
              </div>

              <div className="col-center">
                <div className="card shadow">
                  <div className="card-header">HTTPS</div>
                  <form className="card-body">
                    <div className="form-group d-flex justify-content-between align-items-center">
                      <label className="mb-0">HTTPS</label>
                      <div className="custom-control custom-switch">
                        <input type="checkbox" className="custom-control-input" id="switch-https"/>
                        <label className="custom-control-label" htmlFor="switch-https">
                          <span>開</span>
                          <span>關</span>
                        </label>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>網路服務埠</label>
                      <input className="form-control" type="text" placeholder="請輸入網路服務埠"/>
                      <small className="form-text text-muted">1025 - 65535</small>
                    </div>
                    <div className="form-group">
                      <label>憑證方式</label>
                      <div className="select-wrapper border rounded-pill overflow-hidden">
                        <select className="form-control border-0">
                          <option>Androvideo 自簽憑證</option>
                          <option>自行上傳您的憑證</option>
                          <option>在此裝置上產生憑證</option>
                        </select>
                      </div>
                      <small className="form-text text-muted">SSL 憑證方式</small>
                    </div>

                    <div className="form-group">
                      <label>Certificate</label>
                      <textarea className="form-control" rows="5" placeholder="-----BEGIN CERTIFICATE-----"/>
                    </div>
                    <div className="form-group">
                      <label>Private key</label>
                      <textarea className="form-control" rows="5" placeholder="-----BEGIN PRIVATE KEY-----"/>
                    </div>

                    <div className="form-group">
                      <label>國家</label>
                      <input type="text" className="form-control" placeholder="請輸入您的國家代碼"/>
                      <small className="form-text text-muted">2位字母代碼</small>
                    </div>
                    <div className="form-group">
                      <label>城市</label>
                      <input type="text" className="form-control" placeholder="請輸入您的城市"/>
                    </div>
                    <div className="form-group">
                      <label>組織名稱</label>
                      <input type="text" className="form-control" placeholder="請輸入您的組織名稱"/>
                      <small className="form-text text-muted">公司</small>
                    </div>
                    <div className="form-group">
                      <label>部門名稱</label>
                      <input type="text" className="form-control" placeholder="請輸入部門名稱"/>
                    </div>
                    <div className="form-group">
                      <label>電子信箱</label>
                      <input type="text" className="form-control" placeholder="請輸入您的電子信箱"/>
                    </div>
                    <div className="form-group">
                      <label>域名</label>
                      <input type="text" className="form-control" placeholder="請輸入您的域名"/>
                    </div>

                    <button type="submit" className="btn btn-block btn-primary rounded-pill">套用</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
};
