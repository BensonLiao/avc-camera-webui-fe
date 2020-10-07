const classNames = require('classnames');
const PropTypes = require('prop-types');
const React = require('react');
const progress = require('nprogress');
const {Link, getRouter} = require('capybara-router');
const {Formik, Form, Field} = require('formik');
const Base = require('../shared/base');
const appSettingsValidator = require('../../validations/notifications/app-settings-validator');
const {default: i18n} = require('../../i18n');
const utils = require('../../../core/utils');
const api = require('../../../core/apis/web-api');

// eslint-disable-next-line valid-jsdoc
/**
 * This page will move to event manager in the future
 * @deprecated
 */
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
        utils.showErrorNotification({
          title: `Error ${error.response.status}` || null,
          message: error.response.status === 400 ? error.response.data.message || null : null
        });
      });
  };

  appSettingsFormRender = ({errors, touched}) => {
    return (
      <Form className="card-body">
        <div className="form-group">
          <label>{i18n.t('Device token')}</label>
          <Field
            autoFocus
            name="deviceToken"
            type="text"
            placeholder={i18n.t('Please enter your device token.')}
            className={classNames('form-control', {'is-invalid': errors.deviceToken && touched.deviceToken})}
          />
          {
            errors.deviceToken && touched.deviceToken && (
              <div className="invalid-feedback">{errors.deviceToken}</div>
            )
          }
        </div>
        <div className="form-group">
          <label>{i18n.t('Device id')}</label>
          <Field
            name="deviceId"
            type="text"
            placeholder={i18n.t('Please enter your device id.')}
            className={classNames('form-control', {'is-invalid': errors.deviceId && touched.deviceId})}
          />
          {
            errors.deviceId && touched.deviceId && (
              <div className="invalid-feedback">{errors.deviceId}</div>
            )
          }
        </div>
        <div className="form-group">
          <label>{i18n.t('Notification interval (seconds)')}</label>
          <Field
            name="interval"
            type="text"
            placeholder={i18n.t('Please enter your notification interval.')}
            className={classNames('form-control', {'is-invalid': errors.interval && touched.interval})}
          />
          {
            errors.interval && touched.interval && (
              <div className="invalid-feedback">{errors.interval}</div>
            )
          }
          <small className="form-text text-muted">{i18n.t('5 - 1,800 seconds')}</small>
        </div>
        <button disabled={this.state.$isApiProcessing} type="submit" className="btn btn-primary btn-block rounded-pill">
          {i18n.t('Apply')}
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
              <div className="col-12">
                <nav>
                  <ol className="breadcrumb rounded-pill">
                    <li className="breadcrumb-item active">
                      <Link to="/notification/app">{i18n.t('Notification Settings')}</Link>
                    </li>
                    <li className="breadcrumb-item active">
                      <Link to="/notification/app">{i18n.t('Basic Settings')}</Link>
                    </li>
                    <li className="breadcrumb-item">{i18n.t('App')}</li>
                  </ol>
                </nav>
              </div>

              <div className="col-center">
                <div className="card shadow">
                  <div className="card-header">{i18n.t('App')}</div>
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
