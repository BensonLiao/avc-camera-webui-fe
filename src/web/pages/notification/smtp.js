const classNames = require('classnames');
const PropTypes = require('prop-types');
const React = require('react');
const progress = require('nprogress');
const {getRouter} = require('capybara-router');
const {Formik, Form, Field, ErrorMessage} = require('formik');
const Modal = require('react-bootstrap/Modal').default;
const SMTPEncryptionType = require('webserver-form-schema/constants/smtp-encryption-type');
const SMTPPort = require('webserver-form-schema/constants/smtp-port');
const Base = require('../shared/base');
const smtpSettingsValidator = require('../../validations/notifications/smtp-settings-validator');
const smtpAccountSettingsValidator = require('../../validations/notifications/smtp-account-settings-validator');
const Password = require('../../../core/components/fields/password');
const i18n = require('../../../i18n').default;
const utils = require('../../../core/utils');
const notify = require('../../../core/notify');
const api = require('../../../core/apis/web-api');
const CustomTooltip = require('../../../core/components/tooltip');
const BreadCrumb = require('../../../core/components/fields/breadcrumb').default;

module.exports = class SMTP extends Base {
  static get propTypes() {
    return {
      smtpSettings: PropTypes.shape({
        encryption: PropTypes.oneOf(SMTPEncryptionType.all()),
        host: PropTypes.string.isRequired,
        port: PropTypes.oneOf(SMTPPort.all()),
        account: PropTypes.string.isRequired,
        password: PropTypes.string.isRequired,
        senderName: PropTypes.string.isRequired,
        senderEmail: PropTypes.string.isRequired,
        interval: PropTypes.string.isRequired,
        isEnableLoginNotification: PropTypes.bool.isRequired,
        isEnableAuth: PropTypes.bool.isRequired
      }).isRequired
    };
  }

  constructor(props) {
    super(props);
    this.state.isShowModal = false;
    this.state.accountSettings = this.generateAccountSettingsInitialValues(props.smtpSettings);
  }

  generateSMTPSettingsInitialValues = settings => ({
    host: settings.host,
    senderName: settings.senderName,
    senderEmail: settings.senderEmail,
    interval: settings.interval,
    isEnableLoginNotification: settings.isEnableLoginNotification,
    isEnableAuth: settings.isEnableAuth
  });

  generateAccountSettingsInitialValues = settings => ({
    account: settings.account,
    password: settings.password,
    port: settings.port || SMTPPort['25'],
    encryption: settings.encryption || SMTPEncryptionType.none
  });

  onShowAccountSettingsModal = () => this.setState({isShowModal: true});

  onHideAccountSettingsModal = () => this.setState({isShowModal: false});

  onSubmitAccountSettingsForm = values => this.setState({
    accountSettings: values,
    isShowModal: false
  });

  onSubmitSMTPSettingsForm = values => {
    progress.start();
    api.notification.updateSMTPSettings({
      ...values,
      ...this.state.accountSettings
    })
      .then(response => {
        notify.showSuccessNotification({
          title: i18n.t('Mail Setting Success'),
          message: i18n.t(response.data.isTestMailSent ? 'Test Mail Sent' : 'Account Auth is Off, Test Mail not Sent.')
        });
      })
      .then(getRouter().reload)
      .finally(progress.done);
  };

  accountSettingsFormRender = ({values, errors, touched}) => {
    return (
      <Form>
        <div className="modal-body">
          <div className="form-group">
            <label>{i18n.t('Account')}</label>
            <Field
              name="account"
              type="text"
              className={classNames('form-control', {'is-invalid': errors.account && touched.account})}
              placeholder={i18n.t('Enter your account')}
            />
            <ErrorMessage component="div" name="account" className="invalid-feedback"/>
          </div>
          <div className="form-group has-feedback">
            <label>{i18n.t('Password')}</label>
            <Field
              name="password"
              component={Password}
              inputProps={{
                className: classNames('form-control', {'is-invalid': errors.password && touched.password}),
                placeholder: i18n.t('Enter your password')
              }}
            />
            <ErrorMessage component="div" name="password" className="invalid-feedback"/>
          </div>
          <div className="form-group">
            <label>{i18n.t('Port')}</label>
            <div className="d-flex align-items-center">
              <div className="form-check">
                <Field checked={values.port === SMTPPort['25']} name="port" className="form-check-input" type="radio" id="input-port-25" value={SMTPPort['25']}/>
                <label className="form-check-label" htmlFor="input-port-25">25</label>
              </div>
              <div className="form-check ml-5">
                <Field checked={values.port === SMTPPort['465']} name="port" className="form-check-input" type="radio" id="input-port-465" value={SMTPPort['465']}/>
                <label className="form-check-label" htmlFor="input-port-465">465</label>
              </div>
              <div className="form-check ml-5">
                <Field checked={values.port === SMTPPort['587']} name="port" className="form-check-input" type="radio" id="input-port-587" value={SMTPPort['587']}/>
                <label className="form-check-label" htmlFor="input-port-587">587</label>
              </div>
              <div className="form-check ml-5">
                <Field checked={values.port === SMTPPort['2525']} name="port" className="form-check-input" type="radio" id="input-port-2525" value={SMTPPort['2525']}/>
                <label className="form-check-label" htmlFor="input-port-2525">2525</label>
              </div>
            </div>
          </div>
          <div className="form-group">
            <label>{i18n.t('Encryption')}</label>
            <div className="d-flex align-items-center">
              <div className="form-check">
                <Field checked={values.encryption === SMTPEncryptionType.none} name="encryption" className="form-check-input" type="radio" id="input-encryption-none" value={SMTPEncryptionType.none}/>
                <label className="form-check-label" htmlFor="input-encryption-none">{i18n.t('None')}</label>
              </div>
              <div className="form-check ml-5">
                <Field checked={values.encryption === SMTPEncryptionType.ssl} name="encryption" className="form-check-input" type="radio" id="input-encryption-ssl" value={SMTPEncryptionType.ssl}/>
                <label className="form-check-label" htmlFor="input-encryption-ssl">SSL</label>
              </div>
              <div className="form-check ml-5">
                <Field checked={values.encryption === SMTPEncryptionType.tls} name="encryption" className="form-check-input" type="radio" id="input-encryption-tls" value={SMTPEncryptionType.tls}/>
                <label className="form-check-label" htmlFor="input-encryption-tls">TLS</label>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer flex-column">
          <div className="form-group w-100 mx-0">
            <button type="submit" className="btn btn-primary btn-block rounded-pill">
              {i18n.t('Apply')}
            </button>
          </div>
          <button type="button" className="btn btn-info btn-block m-0 rounded-pill" onClick={this.onHideAccountSettingsModal}>
            {i18n.t('Close')}
          </button>
        </div>
      </Form>
    );
  };

  smtpSettingsFormRender = ({values, errors, touched}) => {
    const {$isApiProcessing} = this.state;
    const {isEnableAuth} = values;
    return (
      <Form className="card shadow">
        <div className="card-header">
          {i18n.t('SMTP Server')}
        </div>
        <div className="card-body">
          <div className="form-group d-flex justify-content-between align-items-center">
            <label>{i18n.t('On/Off')}</label>
            <div className="custom-control custom-switch">
              <Field
                name="isEnableAuth"
                checked={isEnableAuth}
                type="checkbox"
                className="custom-control-input"
                id="switch-auth"
              />
              <label className="custom-control-label" htmlFor="switch-auth">
                <span>{i18n.t('ON')}</span>
                <span>{i18n.t('OFF')}</span>
              </label>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <div className="form-group">
                <label>{i18n.t('Host Address')}</label>
                <Field
                  autoFocus
                  disabled={!isEnableAuth}
                  name="host"
                  type="text"
                  className={classNames('form-control', {'is-invalid': errors.host && touched.host})}
                  placeholder={i18n.t('Enter Your Host Address')}
                />
                <ErrorMessage component="div" name="host" className="invalid-feedback"/>
              </div>
              <div className="form-group d-flex justify-content-between align-items-center">
                <div>
                  <label className="mb-0">{i18n.t('SMTP Account Settings')}</label>
                  <br/>
                </div>
                <div>
                  <CustomTooltip show={!isEnableAuth} title={i18n.t('Please Enable SMTP Server')}>
                    <a
                      href="#"
                      className={classNames('mr-2', {'disable-link': !isEnableAuth})}
                      onClick={event => {
                        event.preventDefault();
                        return isEnableAuth && this.onShowAccountSettingsModal();
                      }}
                    >
                      {i18n.t('Edit Account and Password')}
                    </a>
                  </CustomTooltip>
                  <CustomTooltip title={i18n.t('Some webmail providers may require app passwords for enhanced security, for example, Google and Yahoo Mail accounts. Please follow your webmail provider’s instructions to generate and use an app password.')}>
                    <i className="fas fa-question-circle text-primary"/>
                  </CustomTooltip>
                </div>
              </div>
              <div className="form-group d-flex justify-content-between align-items-center">
                <label>{i18n.t('Login Notification')}</label>
                <CustomTooltip show={!isEnableAuth} title={i18n.t('Please Enable SMTP Server')}>
                  <div className="custom-control custom-switch">
                    <Field
                      disabled={!isEnableAuth}
                      name="isEnableLoginNotification"
                      checked={values.isEnableLoginNotification}
                      type="checkbox"
                      className="custom-control-input"
                      id="switch-login-notification"
                    />
                    <label className="custom-control-label" htmlFor="switch-login-notification">
                      <span>{i18n.t('ON')}</span>
                      <span>{i18n.t('OFF')}</span>
                    </label>
                  </div>
                </CustomTooltip>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="form-group">
              <label>{i18n.t('Sender')}</label>
              <Field
                disabled={!isEnableAuth}
                name="senderName"
                type="text"
                className={classNames('form-control', {'is-invalid': errors.senderName && touched.senderName})}
                placeholder={i18n.t('Enter Your Name')}
              />
              <ErrorMessage component="div" name="senderName" className="invalid-feedback"/>
            </div>
            <div className="form-group">
              <label>{i18n.t('Email')}</label>
              <Field
                disabled={!isEnableAuth}
                name="senderEmail"
                type="text"
                className={classNames('form-control', {'is-invalid': errors.senderEmail && touched.senderEmail})}
                placeholder={i18n.t('Enter Your Email')}
              />
              <ErrorMessage component="div" name="senderEmail" className="invalid-feedback"/>
            </div>
            <div className="form-group">
              <label>{i18n.t('Notification Interval (Seconds)')}</label>
              <Field
                disabled={!isEnableAuth}
                name="interval"
                type="text"
                className={classNames('form-control', {'is-invalid': errors.interval && touched.interval})}
                placeholder={i18n.t('Enter your notification interval')}
              />
              <ErrorMessage component="div" name="interval" className="invalid-feedback"/>
              <small className="form-text text-muted">{i18n.t('5 - 1,800 Seconds')}</small>
            </div>
            <button disabled={$isApiProcessing} type="submit" className="btn btn-primary btn-block rounded-pill mt-5">
              {i18n.t('Apply')}
            </button>
          </div>
        </div>
      </Form>
    );
  };

  render() {
    const {smtpSettings} = this.props;
    const {isShowModal, accountSettings} = this.state;

    return (
      <div className="main-content left-menu-active">
        <div className="page-notification">
          <div className="container-fluid">
            <div className="row">
              <BreadCrumb
                className="px-0"
                path={[i18n.t('Notification Setting'), i18n.t('Basic Setting'), i18n.t('Mail')]}
                routes={['/notification/smtp', '/notification/smtp']}
              />
              <div className="col-center">
                <Formik
                  initialValues={this.generateSMTPSettingsInitialValues(smtpSettings)}
                  validate={utils.makeFormikValidator(smtpSettingsValidator)}
                  onSubmit={this.onSubmitSMTPSettingsForm}
                >
                  {this.smtpSettingsFormRender}
                </Formik>
              </div>
            </div>
          </div>

          <Modal autoFocus={false} show={isShowModal} onHide={this.onHideAccountSettingsModal}>
            <div className="modal-header">
              <h5 className="modal-title">{i18n.t('Email and login settings')}</h5>
            </div>
            <Formik
              validate={utils.makeFormikValidator(smtpAccountSettingsValidator)}
              initialValues={this.generateAccountSettingsInitialValues(accountSettings)}
              onSubmit={this.onSubmitAccountSettingsForm}
            >
              {this.accountSettingsFormRender}
            </Formik>
          </Modal>
        </div>
      </div>
    );
  }
};
