const React = require('react');
const {getRouter} = require('capybara-router');
const progress = require('nprogress');
const Base = require('../shared/base');
const i18n = require('../../i18n').default;
const api = require('../../../core/apis/web-api');
const wrappedApi = require('../../../core/apis');
const download = require('downloadjs');
const CustomNotifyModal = require('../../../core/components/custom-notify-modal');
const StageProgress = require('../../../core/components/stage-progress');
const BreadCrumb = require('../../../core/components/fields/breadcrumb').default;

module.exports = class Log extends Base {
  constructor(props) {
    super(props);
    this.state.file = null;
    this.state.isShowModal = false;
    this.state.isShowApiProcessModal = false;
    this.state.apiProcessModalTitle = i18n.t('Downloading System Log');
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
      .finally(progress.done);
  };

  onClickDownloadLog = event => {
    event.preventDefault();
    progress.start();
    this.setState({
      isShowApiProcessModal: true,
      progressPercentage: 0
    },
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

  showModal = () => {
    this.setState({isShowModal: true});
  };

  hideModal = () => {
    this.setState({isShowModal: false});
  };

  render() {
    const {isShowModal} = this.state;
    return (
      <div className="main-content left-menu-active">
        <div className="section-media">
          <div className="container-fluid">
            <div className="row">
              <BreadCrumb
                className="px-0"
                path={[i18n.t('System'), i18n.t('System Information'), i18n.t('System Log')]}
                routes={['/system/datetime', '/system/log']}
              />
              <div className="col-center">
                <div className="card shadow">
                  <div className="card-header">{i18n.t('System Log')}</div>
                  <div className="card-body">
                    <div className="form-group">
                      <label className="mb-0 my-3">{i18n.t('System Log File Record')}</label>
                      <div>
                        <button
                          className="btn btn-outline-primary rounded-pill px-5"
                          type="button"
                          onClick={this.showModal}
                        >{i18n.t('Delete Record')}
                        </button>
                        <CustomNotifyModal
                          modalType="default"
                          isShowModal={isShowModal}
                          modalTitle={i18n.t('Delete System Log File')}
                          modalBody={i18n.t('Are you sure you want to delete record?')}
                          onHide={this.hideModal}
                          onConfirm={this.onClickClearLog}
                        />
                        <button
                          className="btn btn-outline-primary rounded-pill px-5 ml-3"
                          type="button"
                          onClick={this.onClickDownloadLog}
                        >{i18n.t('Download')}
                        </button>
                        <CustomNotifyModal
                          modalType="process"
                          backdrop="static"
                          isShowModal={this.state.isShowApiProcessModal}
                          modalTitle={this.state.apiProcessModalTitle}
                          modalBody={[
                            <StageProgress
                              key="stage 1"
                              title="System log loading"
                              progressStatus={this.state.progressStatus}
                              progressPercentage={this.state.progressPercentage}
                            />
                          ]}
                          onHide={this.hideApiProcessModal}
                        />
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
