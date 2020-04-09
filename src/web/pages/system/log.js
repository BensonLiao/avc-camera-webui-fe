const React = require('react');
const {Link, getRouter} = require('capybara-router');
const progress = require('nprogress');
const Base = require('../shared/base');
const _ = require('../../../languages');
const api = require('../../../core/apis/web-api');
const utils = require('../../../core/utils');
const download = require('downloadjs');

module.exports = class Log extends Base {
  onClickClearLog = event => {
    event.preventDefault();
    progress.start();
    console.log('clearing');
    api.system.clearLog()
      .then(getRouter().reload)
      .catch(error => {
        progress.done();
        utils.renderError(error);
      });
  };

  onClickDownloadLog = event => {
    event.preventDefault();
    download('/api/system/systeminfo/log.zip');
  }

  render() {
    return (
      <div className="main-content left-menu-active">
        <div className="section-media">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12 px-0">
                <nav>
                  <ol className="breadcrumb rounded-pill">
                    <li className="breadcrumb-item active">
                      <Link to="/system/upgrade">{_('System Settings')}</Link>
                    </li>
                    <li className="breadcrumb-item">{_('System Log')}</li>
                  </ol>
                </nav>
              </div>
              <div className="col-center">
                <div className="card shadow">
                  <div className="card-header">{_('System Log')}</div>
                  <div className="card-body">
                    <div className="form-group mb-0 d-flex justify-content-between align-items-center">
                      <label className="mb-0">{_('Log actions')}</label>
                      <div>
                        <button className="btn btn-outline-primary rounded-pill px-3" type="button" onClick={this.onClickClearLog}>{_('Clear Log')}</button>
                        <button className="btn btn-primary rounded-pill px-3 ml-2" type="button" onClick={this.onClickDownloadLog}>{_('Download')}</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
