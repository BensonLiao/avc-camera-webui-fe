const React = require('react');
const {Link, getRouter} = require('capybara-router');
const progress = require('nprogress');
const Base = require('../shared/base');
const _ = require('../../../languages');
const api = require('../../../core/apis/web-api');
const utils = require('../../../core/utils');
const download = require('downloadjs');
const CustomNotifyModal = require('../../../core/components/custom-notify-modal');
const axios = require('axios');
axios.interceptors.response.use(
  config => config,
  error => {
    if (error.response.status === 408 || error.code === 'ECONNABORTED') {
      console.log(`A timeout happend on url ${error.config.url}`);
    }

    return Promise.reject(error);
  }
);

module.exports = class Log extends Base {
  constructor(props) {
    super(props);
    this.state.file = null;
    this.state.isShowApiProcessModal = false;
    this.state.apiProcessModalTitle = _('Downloading system log');
  }

  hideApiProcessModal = () => {
    this.setState({isShowApiProcessModal: false});
  };

  onClickClearLog = event => {
    event.preventDefault();
    progress.start();
    api.system.clearLog()
      .then(getRouter().reload)
      .catch(error => {
        progress.done();
        utils.showErrorNotification({
          title: `Error ${error.response.status}` || null,
          message: error.response.status === 400 ? error.response.data.message || null : null
        });
      });
  };

  onClickDownloadLog = event => {
    event.preventDefault();
    progress.start();
    this.setState({isShowApiProcessModal: true},
      () => {
        axios.get('/api/system/systeminfo/log.zip', {timeout: 3 * 60 * 1000, responseType: 'blob'})
          .then(response => {
            download(response.data, 'log');
            this.hideApiProcessModal();
            progress.done();
          })
          .catch(error => {
            progress.done();
            utils.showErrorNotification({
              title: `Error ${error.response.status}` || null,
              message: error.response.status === 400 ? error.response.data.message || null : null
            });
          });
      });
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
                      <Link to="/system">{_('System')}</Link>
                    </li>
                    <li className="breadcrumb-item active">
                      <Link to="/system/date">{_('Settings')}</Link>
                    </li>
                    <li className="breadcrumb-item">{_('System Log')}</li>
                  </ol>
                </nav>
              </div>
              <div className="col-center">
                <div className="card shadow">
                  <div className="card-header">{_('Log')}</div>
                  <div className="card-body">
                    <div className="form-group">
                      <label className="mb-0 my-3">{_('System Log File Record')}</label>
                      <div>
                        <button className="btn btn-outline-primary rounded-pill px-5" type="button" onClick={this.onClickClearLog}>{_('Delete Record')}</button>
                        <button className="btn btn-outline-primary rounded-pill px-5 ml-3" type="button" onClick={this.onClickDownloadLog}>{_('Download')}</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <CustomNotifyModal
                modalType="process"
                isShowModal={this.state.isShowApiProcessModal}
                modalTitle={this.state.apiProcessModalTitle}
                onHide={this.hideApiProcessModal}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
