const classNames = require('classnames');
const PropTypes = require('prop-types');
const React = require('react');
const progress = require('nprogress');
const {Link, getRouter} = require('capybara-router');
const {Formik, Form, Field} = require('formik');
const Base = require('../shared/base');
const appSettingsValidator = require('../../validations/notifications/app-settings-validator');
const _ = require('../../../languages');
const utils = require('../../../core/utils');
const api = require('../../../core/apis/web-api');

module.exports = class App extends Base {
  static get propTypes() {
    return {
      appSettings: PropTypes.shape({
        deviceToken: PropTypes.string.isRequired,
        deviceId: PropTypes.string.isRequired,
        interval: PropTypes.string.isRequired
      }).isRequired
    };
  }

  onSubmitAppSettingsForm = values => {
    progress.start();
    api.notification.updateAppSettings(values)
      .then(getRouter().reload)
      .catch(error => {
        progress.done();
        utils.renderError(error);
      });
  };

  appSettingsFormRender = ({errors, touched}) => {
    return (
      <Form className="card-body">
        <div className="form-group">
          <label>{_('Device token')}</label>
          <Field autoFocus name="deviceToken" type="text"
            placeholder={_('Please enter your device token.')}
            className={classNames('form-control', {'is-invalid': errors.deviceToken && touched.deviceToken})}/>
          {
            errors.deviceToken && touched.deviceToken && (
              <div className="invalid-feedback">{errors.deviceToken}</div>
            )
          }
        </div>
        <div className="form-group">
          <label>{_('Device id')}</label>
          <Field name="deviceId" type="text" placeholder={_('Please enter your device id.')}
            className={classNames('form-control', {'is-invalid': errors.deviceId && touched.deviceId})}/>
          {
            errors.deviceId && touched.deviceId && (
              <div className="invalid-feedback">{errors.deviceId}</div>
            )
          }
        </div>
        <div className="form-group">
          <label>{_('Notification interval(second)')}</label>
          <Field name="interval" type="text" placeholder={_('Please enter your notification interval.')}
            className={classNames('form-control', {'is-invalid': errors.interval && touched.interval})}/>
          {
            errors.interval && touched.interval && (
              <div className="invalid-feedback">{errors.interval}</div>
            )
          }
          <small className="form-text text-muted">{_('5 - 1,800 seconds')}</small>
        </div>
        <button disabled={this.state.$isApiProcessing} type="submit" className="btn btn-primary btn-block rounded-pill mt-5">
          {_('Apply')}
        </button>
      </Form>
    );
  };

  render() {
    const {appSettings} = this.props;

    return (
      <div className="main-content left-menu-active">
        <div className="page-notification">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12 px-0">
                <nav>
                  <ol className="breadcrumb rounded-pill">
                    <li className="breadcrumb-item active">
                      <Link to="/notification/app">{_('Notification settings')}</Link>
                    </li>
                    <li className="breadcrumb-item active">
                      <Link to="/notification/app">{_('Basic settings')}</Link>
                    </li>
                    <li className="breadcrumb-item">{_('App')}</li>
                  </ol>
                </nav>
              </div>

              <div className="col-center">
                <div className="card shadow">
                  <div className="card-header">{_('App')}</div>
                  <Formik
                    validate={utils.makeFormikValidator(appSettingsValidator)}
                    initialValues={appSettings}
                    onSubmit={this.onSubmitAppSettingsForm}
                  >
                    {this.appSettingsFormRender}
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
