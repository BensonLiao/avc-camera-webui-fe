const React = require('react');
const PropTypes = require('prop-types');
const {Link, getRouter} = require('capybara-router');
const progress = require('nprogress');
const {Formik, Form, Field} = require('formik');
const Base = require('../shared/base');
const api = require('../../../core/apis/web-api');
const {utils} = require('../../../core/utils');
const _ = require('../../../languages');

module.exports = class TCPIP extends Base {
  static get propTypes() {
    return {
      ddnsInfo: PropTypes.shape({
        isEnableDDNS: PropTypes.bool.isRequired,
        ddnsProvider: PropTypes.string.isRequired,
        ddnsHost: PropTypes.string.isRequired,
        ddnsAccount: PropTypes.string.isRequired,
        ddnsPassword: PropTypes.string.isRequired
      }).isRequired,
      httpInfo: PropTypes.shape({
        port: PropTypes.string.isRequired
      }).isRequired
    };
  }

  onSubmitDDNSForm = values => {
    progress.start();
    api.system.updateDDNSInfo(values)
      .then(getRouter().reload)
      .catch(error => {
        progress.done();
        utils.renderError(error);
      });
  }

  onSubmitHTTPForm = values => {
    progress.start();
    api.system.updateHttpInfo(values)
      .then(() => new Promise(resolve => {
        // Check the server was shut down.
        const test = () => {
          api.ping()
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
        // Redirect to the home page with off-line access.
        location.href = '/';
      })
      .catch(error => {
        progress.done();
        utils.renderError(error);
      });
  }

  ddnsFormRender = ({values}) => {
    const {$isApiProcessing} = this.state;
    return (
      <Form className="tab-pane fade show active" id="tab-ddns">
        <div className="form-group d-flex justify-content-between align-items-center">
          <label className="mb-0">DDNS 伺服器</label>
          <div className="custom-control custom-switch">
            <Field name="isEnableDDNS" checked={values.isEnableDDNS} type="checkbox" className="custom-control-input" id="switch-ddns-enable"/>
            <label className="custom-control-label" htmlFor="switch-ddns-enable">
              <span>開</span>
              <span>關</span>
            </label>
          </div>
        </div>
        <div className="form-group">
          <label>服務提供</label>
          <div className="select-wrapper border rounded-pill overflow-hidden">
            <Field name="ddnsProvider" component="select" className="form-control border-0">
              <option value="dyn-dns">DynDNS.org</option>
            </Field>
          </div>
        </div>
        <div className="form-group">
          <label>主機名稱</label>
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
          <label>帳號</label>
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
          <label>密碼</label>
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
        >
          套用
        </button>
      </Form>
    );
  }

  httpFormRender = () => {
    return (
      <Form className="tab-pane fad" id="tab-http">
        <div className="form-group">
          <label>網頁服務埠設定</label>
          <input className="form-control" type="text" placeholder="請輸入您的服務埠"/>
        </div>
        <button type="submit" className="btn btn-primary btn-block rounded-pill" onClick={this.onClick}>套用</button>
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
              <div className="col-12">
                <nav>
                  <ol className="breadcrumb rounded-pill">
                    <li className="breadcrumb-item active">
                      <Link to="/network/tcp-ip">{_('Internet/Network')}</Link>
                    </li>

                    <li className="breadcrumb-item">{_('TCP/IP')}</li>
                  </ol>
                </nav>
              </div>

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
