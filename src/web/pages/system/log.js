const React = require('react');
const {Link, getRouter} = require('capybara-router');
const progress = require('nprogress');
const Base = require('../shared/base');
const _ = require('../../../languages');
const api = require('../../../core/apis/web-api');
const wrappedApi = require('../../../core/apis');
const utils = require('../../../core/utils');
const download = require('downloadjs');
const CustomNotifyModal = require('../../../core/components/custom-notify-modal');
const StageProgress = require('../../../core/components/stage-progress');

module.exports = class Log extends Base {
  constructor(props) {
    super(props);
    this.state.file = null;
    this.state.isShowApiProcessModal = false;
    this.state.apiProcessModalTitle = _('Downloading system log');
    this.state.progressStatus = 'start';
    this.state.progressPercentage = 0;
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
        wrappedApi({
          method: 'get',
          url: '/api/system/systeminfo/log.zip',
          responseType: 'blob',
          onDownloadProgress: progressEvent => {
            // Do whatever you want with the native progress event
            this.setState({progressPercentage: Math.round((progressEvent.loaded / progressEvent.total) * 100)});
          }
        })
          .then(response => {
            download(response.data, 'log');
          })
          .finally(() => {
            progress.done();
            this.hideApiProcessModal();
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
                  <div className="card-header">{_('System Log')}</div>
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
                modalBody={[
                  <StageProgress key="stage 1" title="System log loading" progressStatus={this.state.progressStatus} progressPercentage={this.state.progressPercentage}/>
                ]}
                onHide={this.hideApiProcessModal}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
