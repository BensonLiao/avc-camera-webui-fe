const React = require('react');
const {Link} = require('capybara-router');
const {Formik, Form} = require('formik');
const progress = require('nprogress');
const Base = require('../shared/base');
const _ = require('../../../languages');
const api = require('../../../core/apis/web-api');
const utils = require('../../../core/utils');
const CustomNotifyModal = require('../../../core/components/custom-notify-modal');
const StageProgress = require('../../../core/components/stage-progress');

module.exports = class Upgrade extends Base {
  constructor(props) {
    super(props);
    this.state.file = null;
    this.state.isShowApiProcessModal = false;
    this.state.apiProcessModalTitle = _('Device processing');
    this.state.apiProcessModalBody = null;
    this.state.progressStatus = {
      uploadFirmware: 'start',
      upgradeFirmware: 'start'
    };
    this.state.progressPercentage = {
      uploadFirmware: 0,
      upgradeFirmware: 0
    };
  }

  updateProgress = (stage, progress) => {
    this.setState(prevState => ({
      progressPercentage: {
        ...prevState.progressPercentage,
        [stage]: progress
      }
    }));
  };

  updateProgressStatus = (stage, progressStatus) => {
    this.setState(prevState => ({
      progressStatus: {
        ...prevState.progressStatus,
        [stage]: progressStatus
      }
    }));
  };

  hideApiProcessModal = () => {
    this.setState({isShowApiProcessModal: false});
  };

  onChangeFile = event => {
    this.setState({file: event.target.files[0]});
  };

  onSubmitForm = () => {
    const {file} = this.state;
    progress.start();
    this.setState({
      isShowApiProcessModal: true,
      apiProcessModalTitle: _('Firmware uploading')
    },
    () => {
      api.system.uploadFirmware(file, this.updateProgress)
        .then(response => new Promise(resolve => {
          this.updateProgressStatus('uploadFirmware', 'done');
          this.setState({apiProcessModalTitle: _('Firmware upgrading')});
          const upgrade = init => {
            api.system.upgradeFirmware(init ? response.data.filename : null)
              .then(response => {
                if (response.data.updateStatus === 2) {
                  this.updateProgress('upgradeFirmware', 100);
                  this.updateProgressStatus('upgradeFirmware', 'done');
                  resolve();
                } else {
                  this.updateProgress('upgradeFirmware', response.data.updateProgress);
                  setTimeout(() => {
                    upgrade(false);
                  }, 2000);
                }
              })
              .catch(error => {
                progress.done();
                this.hideApiProcessModal();
                utils.showErrorNotification({
                  title: `Error ${error.response.status}` || null,
                  message: error.response.status === 400 ? error.response.data.message || null : null
                });
              });
          };

          upgrade(true);
        }))
        .then(() => {
          // Keep modal and update the title and body.
          this.setState({
            apiProcessModalTitle: _('Device rebooting'),
            apiProcessModalBody: _('Please wait')
          });
          // Check the server was start up, if success then startup was failed and retry.
          const test = () => {
            api.ping('app')
              .then(response => {
                console.log('ping app response(userinitiated)', response);
                // Add 2 sec delay to make sure server are ready.
                setTimeout(location.reload, 2000);
              })
              .catch(() => {
                setTimeout(test, 1000);
              });
          };

          test();
        })
        .catch(error => {
          progress.done();
          this.hideApiProcessModal();
          utils.showErrorNotification({
            title: `Error ${error.response.status}` || null,
            message: error.response.status === 400 ? error.response.data.message || null : null
          });
        });
    });
  };

  formRender = () => {
    const {$isApiProcessing, file} = this.state;

    return (
      <Form className="card-body">
        <div className="form-group">
          <label className="mb-0">{_('Import File')}</label>
          <small className="form-text text-muted my-2">
            {_('Only .Zip File Supported')}
          </small>
          <div>
            <label className="btn btn-outline-primary rounded-pill font-weight-bold px-5">
              <input disabled={$isApiProcessing} type="file" className="d-none" accept=".zip" onChange={this.onChangeFile}/>{_('Select File')}
            </label>
            {
              file ?
                <span className="text-size-14 text-muted ml-3">{_(file.name)}</span> :
                <span className="text-size-14 text-muted ml-3">{_('No Files Selected')}</span>
            }
          </div>
        </div>
        <button disabled={$isApiProcessing || !file} className="btn btn-primary btn-block rounded-pill" type="submit">
          {_('Firmware Upgrade')}
        </button>
      </Form>
    );
  };

  render() {
    const {progressStatus, progressPercentage} = this.state;
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
                    <li className="breadcrumb-item">{_('Firmware Upgrade')}</li>
                  </ol>
                </nav>
              </div>

              <CustomNotifyModal
                modalType="process"
                isShowModal={this.state.isShowApiProcessModal}
                modalTitle={this.state.apiProcessModalTitle}
                modalBody={this.state.apiProcessModalBody ?
                  this.state.apiProcessModalBody :
                  [
                    <StageProgress key="stage 1" title="Firmware uploading" progressStatus={progressStatus.uploadFirmware} progressPercentage={progressPercentage.uploadFirmware}/>,
                    <StageProgress key="stage 2" title="Firmware upgrading" progressStatus={progressStatus.upgradeFirmware} progressPercentage={progressPercentage.upgradeFirmware}/>
                  ]}
                onHide={this.hideApiProcessModal}/>

              <div className="col-center">
                <div className="card shadow">
                  <div className="card-header">{_('Firmware Upgrade')}</div>
                  <Formik initialValues={{}} onSubmit={this.onSubmitForm}>
                    {this.formRender}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
