const React = require('react');
const {Link} = require('capybara-router');
const {Formik, Form} = require('formik');
const progress = require('nprogress');
const Base = require('../shared/base');
const _ = require('../../../languages');
const api = require('../../../core/apis/web-api');
const utils = require('../../../core/utils');

module.exports = class Upgrade extends Base {
  constructor(props) {
    super(props);
    this.state.file = null;
  }

  onChangeFile = event => {
    this.setState({file: event.target.files[0]});
  };

  onSubmitForm = () => {
    const {file} = this.state;

    progress.start();
    api.system.uploadFirmware(file)
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
                    <li className="breadcrumb-item">{_('Firmware Upgrade')}</li>
                  </ol>
                </nav>
              </div>

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
