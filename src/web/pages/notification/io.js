const classNames = require('classnames');
const progress = require('nprogress');
const PropTypes = require('prop-types');
const React = require('react');
const {Link, getRouter} = require('capybara-router');
const {Formik, Form, Field} = require('formik');
const IOType = require('webserver-form-schema/constants/io-type');
const GateType = require('webserver-form-schema/constants/gate-type');
const ioOutSettingsValidator = require('../../validations/notifications/io-out-settings-validator');
const Base = require('../shared/base');
const _ = require('../../../languages');
const utils = require('../../../core/utils');
const api = require('../../../core/apis/web-api');

module.exports = class IO extends Base {
  static get propTypes() {
    return {
      ioInSettings: PropTypes.shape({
        isEnable: PropTypes.bool.isRequired,
        ioType: PropTypes.oneOf(IOType.all()).isRequired
      }).isRequired,
      ioOutASettings: PropTypes.shape({
        isEnable: PropTypes.bool.isRequired,
        ioType: PropTypes.oneOf(IOType.all()).isRequired,
        gateType: PropTypes.oneOf(GateType.all()).isRequired,
        pulse: PropTypes.string.isRequired,
        delay: PropTypes.string.isRequired
      }).isRequired,
      ioOutBSettings: PropTypes.shape({
        isEnable: PropTypes.bool.isRequired,
        ioType: PropTypes.oneOf(IOType.all()).isRequired,
        gateType: PropTypes.oneOf(GateType.all()).isRequired,
        pulse: PropTypes.string.isRequired,
        delay: PropTypes.string.isRequired
      }).isRequired
    };
  }

  generateIOOutSettingsSubmitHandler = index => values => {
    progress.start();
    api.notification.updateIOOutSettings(index, values)
      .then(getRouter().reload)
      .catch(error => {
        progress.done();
        utils.showErrorNotification({
          title: `Error ${error.response.status}` || null,
          message: error.response.status === 400 ? error.response.data.message || null : null
        });
      });
  };

  generateIOOutSettingsFormRender = index => ({values, errors, touched}) => {
    const {$isApiProcessing} = this.state;

    return (
      <Form className="tab-pane fade" id={`tab-output-${index + 1}`}>
        <div className="form-group d-flex justify-content-between align-items-center">
          <label>{_('I/O Output {0}', [index + 1])}</label>
          <div className="custom-control custom-switch">
            <Field name="isEnable" checked={values.isEnable} type="checkbox" className="custom-control-input" id={`switch-output-${index}`}/>
            <label className="custom-control-label" htmlFor={`switch-output-${index}`}>
              <span>{_('ON')}</span>
              <span>{_('OFF')}</span>
            </label>
          </div>
        </div>
        <div className="form-group">
          <label>{_('I/O Type')}</label>
          <div className="d-flex align-items-center">
            <div className="form-check">
              <Field name="ioType" className="form-check-input" type="radio" id={`input-output${index}-normally-open`} value={IOType.normallyOpen}/>
              <label className="form-check-label" htmlFor={`input-output${index}-normally-open`}>{_('Normally Open')}</label>
            </div>
            <div className="form-check ml-5">
              <Field name="ioType" className="form-check-input" type="radio" id={`input-output${index}-normally-closed`} value={IOType.normallyClosed}/>
              <label className="form-check-label" htmlFor={`input-output${index}-normally-closed`}>{_('Normally Closed')}</label>
            </div>
          </div>
        </div>
        <div className="form-group">
          <label>{_('Gate Type')}</label>
          <div className="d-flex align-items-center">
            <div className="form-check">
              <Field name="gateType" className="form-check-input" type="radio" id={`input-output${index}-normal`} value={GateType.normal}/>
              <label className="form-check-label" htmlFor={`input-output${index}-normal`}>{_('Normal')}</label>
            </div>
            <div className="form-check ml-5">
              <Field name="gateType" className="form-check-input" type="radio" id={`input-output${index}-debounce`} value={GateType.buffer}/>
              <label className="form-check-label" htmlFor={`input-output${index}-debounce`}>{_('Buffer')}</label>
            </div>
          </div>
        </div>
        <div className="form-group">
          <label>{_('Signal Buffer Time (Seconds)')}</label>
          <Field name="pulse" type="text"
            className={classNames('form-control', {'is-invalid': errors.pulse && touched.pulse})}
            placeholder={_('Enter seconds')}/>
          {
            errors.pulse && touched.pulse && (
              <div className="invalid-feedback">{errors.pulse}</div>
            )
          }
          <small className="form-text text-muted">{_('1 - 80 Seconds')}</small>
        </div>
        <div className="form-group">
          <label>{_('Delay Time (Seconds)')}</label>
          <Field name="delay" type="text"
            className={classNames('form-control', {'is-invalid': errors.delay && touched.delay})}
            placeholder={_('Enter seconds')}/>
          {
            errors.delay && touched.delay && (
              <div className="invalid-feedback">{errors.delay}</div>
            )
          }
          <small className="form-text text-muted">{_('5 - 1,800 Seconds')}</small>
        </div>
        <button disabled={$isApiProcessing} type="submit" className="btn btn-primary btn-block rounded-pill mt-5">
          {_('Apply')}
        </button>
      </Form>
    );
  };

  onSubmitIOInSettingsForm = values => {
    progress.start();
    api.notification.updateIOInSettings(values)
      .then(getRouter().reload)
      .catch(error => {
        progress.done();
        utils.showErrorNotification({
          title: `Error ${error.response.status}` || null,
          message: error.response.status === 400 ? error.response.data.message || null : null
        });
      });
  };

  ioInSettingsFormRender = ({values}) => {
    const {$isApiProcessing} = this.state;

    return (
      <Form className="tab-pane fade show active" id="tab-input">
        <div className="form-group d-flex justify-content-between align-items-center">
          <label>{_('I/O Input')}</label>
          <div className="custom-control custom-switch">
            <Field name="isEnable" checked={values.isEnable} type="checkbox" className="custom-control-input" id="switch-input"/>
            <label className="custom-control-label" htmlFor="switch-input">
              <span>{_('ON')}</span>
              <span>{_('OFF')}</span>
            </label>
          </div>
        </div>
        <div className="form-group">
          <label>{_('I/O Type')}</label>
          <div className="d-flex align-items-center">
            <div className="form-check">
              <Field name="ioType" className="form-check-input" type="radio" id="input-input-normally-open" value={IOType.normallyOpen}/>
              <label className="form-check-label" htmlFor="input-input-normally-open">
                {_('Normally Open')}
              </label>
            </div>
            <div className="form-check ml-5">
              <Field name="ioType" className="form-check-input" type="radio" id="input-input-normally-closed" value={IOType.normallyClosed}/>
              <label className="form-check-label" htmlFor="input-input-normally-closed">
                {_('Normally Closed')}
              </label>
            </div>
          </div>
        </div>
        <button disabled={$isApiProcessing} type="submit" className="btn btn-primary btn-block rounded-pill mt-5">
          {_('Apply')}
        </button>
      </Form>
    );
  };

  render() {
    const {ioInSettings, ioOutASettings, ioOutBSettings} = this.props;

    return (
      <div className="main-content left-menu-active">
        <div className="page-notification">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12 px-0">
                <nav>
                  <ol className="breadcrumb rounded-pill">
                    <li className="breadcrumb-item active">
                      <Link to="/notification/smtp">{_('Notification')}</Link>
                    </li>
                    <li className="breadcrumb-item active">
                      <Link to="/notification/smtp">{_('Basic Setting')}</Link>
                    </li>
                    <li className="breadcrumb-item">{_('I/O')}</li>
                  </ol>
                </nav>
              </div>

              <div className="col-center">
                <div className="card shadow">
                  <div className="card-header">{_('I/O')}</div>
                  <nav>
                    <div className="nav nav-tabs">
                      <a className="nav-item nav-link active" data-toggle="tab" href="#tab-input">{_('I/O Input')}</a>
                      <a className="nav-item nav-link" data-toggle="tab" href="#tab-output-1">{_('I/O Output {0}', [1])}</a>
                      <a className="nav-item nav-link" data-toggle="tab" href="#tab-output-2">{_('I/O Output {0}', [2])}</a>
                    </div>
                  </nav>
                  <div className="card-body tab-content">
                    <Formik
                      initialValues={ioInSettings}
                      onSubmit={this.onSubmitIOInSettingsForm}
                    >
                      {this.ioInSettingsFormRender}
                    </Formik>

                    <Formik
                      initialValues={ioOutASettings}
                      validate={utils.makeFormikValidator(ioOutSettingsValidator)}
                      onSubmit={this.generateIOOutSettingsSubmitHandler(0)}
                    >
                      {this.generateIOOutSettingsFormRender(0)}
                    </Formik>

                    <Formik
                      initialValues={ioOutBSettings}
                      validate={utils.makeFormikValidator(ioOutSettingsValidator)}
                      onSubmit={this.generateIOOutSettingsSubmitHandler(1)}
                    >
                      {this.generateIOOutSettingsFormRender(1)}
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
