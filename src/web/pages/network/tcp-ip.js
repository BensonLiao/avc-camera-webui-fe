const React = require('react');
const PropTypes = require('prop-types');
const classNames = require('classnames');
const progress = require('nprogress');
const {Link, getRouter} = require('capybara-router');
const {Formik, Form, Field} = require('formik');
const Base = require('../shared/base');
const api = require('../../../core/apis/web-api');
const utils = require('../../../core/utils');
const _ = require('../../../languages');
const CustomNotifyModal = require('../../../core/components/custom-notify-modal');

module.exports = class TCPIP extends Base {
  static get propTypes() {
    return {
      ddnsInfo: PropTypes.shape({
        isEnableDDNS: PropTypes.bool.isRequired,
        ddnsProvider: PropTypes.string.isRequired,
        ddnsHost: PropTypes.string.isRequired,
        ddnsAccount: PropTypes.string.isRequired,
        ddnsPassword: PropTypes.string.isRequired,
        ddnsRefreshStatus: PropTypes.bool.isRequired,
        ddnsHostStatus: PropTypes.bool.isRequired
      }).isRequired,
      httpInfo: PropTypes.shape({
        port: PropTypes.string.isRequired,
        port2: PropTypes.string
      }).isRequired
    };
  }

  constructor(props) {
    super(props);
    this.state.isShowApiProcessModal = false;
    this.state.apiProcessModalTitle = _('Device processing');
  }

  hideApiProcessModal = () => {
    this.setState({isShowApiProcessModal: false});
  };

  checkValidatePort = values => {
    return utils.validatedPortCheck(values);
  }

  onSubmitDDNSForm = values => {
    progress.start();
    api.system.updateDDNSInfo(values)
      .then(response => {
        if (response.data.ddnsHostStatus) {
          utils.showSuccessNotification({
            title: _('Setting Success'),
            message: _('DDNS setting success!')
          });
        } else {
          utils.showErrorNotification({
            title: _('Setting Failed'),
            message: _('DDNS setting failed!')
          });
        }

        getRouter().reload();
      })
      .catch(error => {
        progress.done();
        utils.showErrorNotification({
          title: `Error ${error.response.status}` || null,
          message: error.response.status === 400 ? error.response.data.message || null : null
        });
      });
  }

  onSubmitHTTPForm = values => {
    progress.start();
    this.setState({
      isShowApiProcessModal: true,
      apiProcessModalTitle: _('Updating http settings')
    },
    () => {
      api.system.updateHttpInfo(values)
        .then(() => {
          api.system.deviceReboot()
            .then(() => new Promise(resolve => {
              // Check the server was shut down, if success then shutdown was failed and retry.
              const test = () => {
                api.ping('web')
                  .then(() => {
                    setTimeout(test, 500);
                  })
                  .catch(() => {
                    resolve();
                  });
              };

              test();
            }))
            .then(() => {
              // Keep modal and update the title.
              this.setState({apiProcessModalTitle: _('Device rebooting')});
              // Check the server was start up, if success then startup was failed and retry.
              const test = () => {
                api.ping('app')
                  .then(() => {
                    location.reload();
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
  }

  ddnsFormRender = ({values}) => {
    const {$isApiProcessing} = this.state;
    return (
      <Form className="tab-pane fade show active" id="tab-ddns">
        <div className="form-group d-flex justify-content-between align-items-center">
          <label className="mb-0">{_('DDNS Server')}</label>
          <div className="custom-control custom-switch">
            <Field name="isEnableDDNS" checked={values.isEnableDDNS} type="checkbox" className="custom-control-input" id="switch-ddns-enable"/>
            <label className="custom-control-label" htmlFor="switch-ddns-enable">
              <span>{_('ON')}</span>
              <span>{_('OFF')}</span>
            </label>
          </div>
        </div>
        <div className="form-group">
          <label>{_('Server Provider')}</label>
          <div className="select-wrapper border rounded-pill overflow-hidden">
            <Field name="ddnsProvider" component="select" className="form-control border-0">
              <option value="dyn-dns">DynDNS.org</option>
            </Field>
          </div>
        </div>
        <div className="form-group">
          <label>{_('Host Name')}</label>
          <Field
            className="form-control"
            type="text"
            name="ddnsHost"
            placeholder={_('Enter DDNS Host')}
            value={values.ddnsHost}
            disabled={!values.isEnableDDNS}
          />
        </div>
        <div className="form-group">
          <label>{_('Account')}</label>
          <Field
            className="form-control"
            type="text"
            name="ddnsAccount"
            placeholder={_('Enter DDNS Account')}
            value={values.ddnsAccount}
            disabled={!values.isEnableDDNS}
          />
        </div>
        <div className="form-group">
          <label>{_('Password')}</label>
          <Field
            className="form-control"
            type="text"
            name="ddnsPassword"
            placeholder={_('Enter DDNS Password')}
            value={values.ddnsPassword}
            disabled={!values.isEnableDDNS}
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary btn-block rounded-pill"
          disabled={$isApiProcessing}
        >{_('Apply')}
        </button>
      </Form>
    );
  }

  httpFormRender = ({values, errors, touched}) => {
    return (
      <Form className="tab-pane fad" id="tab-http">
        <div className="form-group mb-5">
          <label>{_('Secondary Web Server Port')}</label>
          <Field
            name="port"
            className={classNames('form-control', {'is-invalid': errors.port && touched.port})}
            type="text"
            validate={this.checkValidatePort}
            placeholder={_('Enter Your Secondary Server Port')}
            value={values.port}
          />
          {errors.port && touched.port && (<div className="invalid-feedback">{errors.port}</div>)}
          <p className="text-size-14 text-muted mt-2">{_('Default primary port is 80')}</p>
        </div>
        <button type="submit" className="btn btn-primary btn-block rounded-pill" onClick={this.onClick}>{_('Apply')}</button>
      </Form>
    );
  }

  render() {
    const {ddnsInfo, httpInfo} = this.props;

    return (
      <div className="main-content left-menu-active">
        <div className="page-notification">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12 px-0">
                <nav>
                  <ol className="breadcrumb rounded-pill">
                    <li className="breadcrumb-item active">
                      <Link to="/network/tcp-ip">{_('Internet/Network Settings')}</Link>
                    </li>

                    <li className="breadcrumb-item">{_('TCP/IP')}</li>
                  </ol>
                </nav>
              </div>

              <CustomNotifyModal
                modalType="process"
                isShowModal={this.state.isShowApiProcessModal}
                modalTitle={this.state.apiProcessModalTitle}
                onHide={this.hideApiProcessModal}/>

              <div className="col-center">
                <div className="card shadow">
                  <div className="card-header">
                    {_('TCP/IP')}
                  </div>
                  <nav>
                    <div className="nav nav-tabs">
                      <a className="nav-item nav-link active" data-toggle="tab" href="#tab-ddns">DDNS</a>
                      <a className="nav-item nav-link" data-toggle="tab" href="#tab-http">HTTP</a>
                    </div>
                  </nav>
                  <div className="card-body tab-content">
                    <Formik
                      initialValues={ddnsInfo}
                      onSubmit={this.onSubmitDDNSForm}
                    >
                      {this.ddnsFormRender}
                    </Formik>
                    <Formik
                      initialValues={httpInfo}
                      onSubmit={this.onSubmitHTTPForm}
                    >
                      {this.httpFormRender}
                    </Formik>

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
