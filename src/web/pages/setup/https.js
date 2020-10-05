const classNames = require('classnames');
const React = require('react');
const {getRouter} = require('capybara-router');
const {Formik, Form, Field} = require('formik');
const progress = require('nprogress');
const CertificateType = require('webserver-form-schema/constants/certificate-type');
const logo = require('../../../resource/logo-avc-secondary.svg');
const setupStep03 = require('../../../resource/setup-step-03.png');
const setupStep03x2 = require('../../../resource/setup-step-03@2x.png');
const {default: i18n} = require('../../i18n');
const Base = require('../shared/base');
const store = require('../../../core/store');
const utils = require('../../../core/utils');
const uploadCertificateValidator = require('../../validations/setup/https-upload-certificate-validator');
const generateCertificateValidator = require('../../validations/setup/https-generate-certificate-validator');
const api = require('../../../core/apis/web-api');
const {default: ProgressBar} = require('./progress-bar');

module.exports = class SetupHTTPS extends Base {
  constructor(props) {
    super(props);
    this.state.certificateType = store.get('$setup').https.certificateType;
  }

  componentDidMount() {
    super.componentDidMount();
    const $setup = store.get('$setup');
    if (!$setup.account.account) {
      getRouter().go('/setup/account', {replace: true});
    }
  }

  generateValidator = () => {
    switch (this.state.certificateType) {
      case CertificateType.uploadCertificate:
        return utils.makeFormikValidator(uploadCertificateValidator);
      case CertificateType.generateCertificate:
        return utils.makeFormikValidator(generateCertificateValidator);
      default:
        return null;
    }
  };

  /**
   * @param {Function} next
   * @returns {Function}
   */
  generateChangeCertificateTypeHandler = next => {
    return event => {
      this.setState({certificateType: event.target.value});
      if (typeof next === 'function') {
        next(event);
      }
    };
  };

  /**
   * @param {Object} values
   * @returns {void}
   */
  onSubmitSetupHTTPSForm = values => {
    const $setup = store.get('$setup');

    progress.start();
    api.system.setup({
      language: $setup.language,
      account: $setup.account,
      https: values
    })
      .then(() => {
        location.href = '/';
      })
      .finally(progress.done);
  };

  setupHTTPSFormRender = ({errors, submitCount, values, handleChange}) => {
    const isSubmitted = submitCount > 0;
    const classTable = {
      certificate: classNames(
        'form-control', {'is-invalid': errors.certificate && isSubmitted}
      ),
      privateKey: classNames(
        'form-control', {'is-invalid': errors.privateKey && isSubmitted}
      ),
      country: classNames(
        'form-control', {'is-invalid': errors.country && isSubmitted}
      ),
      state: classNames(
        'form-control', {'is-invalid': errors.state && isSubmitted}
      ),
      city: classNames(
        'form-control', {'is-invalid': errors.city && isSubmitted}
      ),
      organization: classNames(
        'form-control', {'is-invalid': errors.organization && isSubmitted}
      ),
      organizationUnit: classNames(
        'form-control', {'is-invalid': errors.organizationUnit && isSubmitted}
      ),
      email: classNames(
        'form-control', {'is-invalid': errors.email && isSubmitted}
      ),
      domain: classNames(
        'form-control', {'is-invalid': errors.domain && isSubmitted}
      )
    };

    return (
      <Form className="card shadow mb-5">
        <div className="card-body">
          <ProgressBar
            step={3}
            progressBarImage={setupStep03}
            progressBarImagex2={setupStep03x2}
          />
          <div className="form-group">
            <label>{i18n.t('Certificate type')}</label>
            <div className="select-wrapper border rounded-pill overflow-hidden px-2">
              <Field
                name="certificateType"
                component="select"
                className="form-control border-0"
                onChange={this.generateChangeCertificateTypeHandler(handleChange)}
              >
                <option value={CertificateType.selfSigned}>{i18n.t(`certificate-type-${CertificateType.selfSigned}`)}</option>
                <option value={CertificateType.uploadCertificate}>{i18n.t(`certificate-type-${CertificateType.uploadCertificate}`)}</option>
                <option value={CertificateType.generateCertificate}>{i18n.t(`certificate-type-${CertificateType.generateCertificate}`)}</option>
              </Field>
            </div>
            <small className="form-text text-muted">{i18n.t('SSL certificate.')}</small>
          </div>

          {
            /* Upload your certificate. */
            values.certificateType === CertificateType.uploadCertificate && (
              <>
                <div className="form-group">
                  <label>{i18n.t('Certificate')}</label>
                  <Field name="certificate" component="textarea" className={classTable.certificate} rows="5" maxLength="10240" placeholder="-----BEGIN CERTIFICATE-----"/>
                  {
                    errors.certificate && isSubmitted && (
                      <div className="invalid-feedback">{errors.certificate}</div>
                    )
                  }
                </div>
                <div className="form-group">
                  <label>{i18n.t('Private key')}</label>
                  <Field name="privateKey" component="textarea" className={classTable.privateKey} rows="5" maxLength="1024" placeholder="-----BEGIN PRIVATE KEY-----"/>
                  {
                    errors.privateKey && isSubmitted && (
                      <div className="invalid-feedback">{errors.privateKey}</div>
                    )
                  }
                </div>
              </>
            )
          }

          {
            /* Generate the certificate on this device. */
            values.certificateType === CertificateType.generateCertificate && (
              <>
                <div className="form-group">
                  <label>{i18n.t('Country name')}</label>
                  <Field name="country" maxLength="2" className={classTable.country} placeholder={i18n.t('Please enter the country code.')}/>
                  {
                    errors.country && isSubmitted && (
                      <div className="invalid-feedback">{errors.country}</div>
                    )
                  }
                  <small className="form-text text-muted">{i18n.t('Two letters.')}</small>
                </div>
                <div className="form-group">
                  <label>{i18n.t('State or province name')}</label>
                  <Field name="state" maxLength="1024" className={classTable.state} placeholder={i18n.t('Please enter the state or province name.')}/>
                  {
                    errors.state && isSubmitted && (
                      <div className="invalid-feedback">{errors.state}</div>
                    )
                  }
                </div>
                <div className="form-group">
                  <label>{i18n.t('City name')}</label>
                  <Field name="city" maxLength="1024" className={classTable.city} placeholder={i18n.t('Please enter the city name.')}/>
                  {
                    errors.city && isSubmitted && (
                      <div className="invalid-feedback">{errors.city}</div>
                    )
                  }
                </div>
                <div className="form-group">
                  <label>{i18n.t('Organization name')}</label>
                  <Field name="organization" maxLength="1024" className={classTable.organization} placeholder={i18n.t('Please enter the organization name.')}/>
                  {
                    errors.organization && isSubmitted && (
                      <div className="invalid-feedback">{errors.organization}</div>
                    )
                  }
                  <small className="form-text text-muted">{i18n.t('The company.')}</small>
                </div>
                <div className="form-group">
                  <label>{i18n.t('Organization unit name')}</label>
                  <Field name="organizationUnit" maxLength="1024" className={classTable.organizationUnit} placeholder={i18n.t('Please enter the organization unit name.')}/>
                  {
                    errors.organizationUnit && isSubmitted && (
                      <div className="invalid-feedback">{errors.organizationUnit}</div>
                    )
                  }
                </div>
                <div className="form-group">
                  <label>{i18n.t('Email address')}</label>
                  <Field name="email" maxLength="1024" className={classTable.email} placeholder={i18n.t('Please enter the email address.')}/>
                  {
                    errors.email && isSubmitted && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )
                  }
                </div>
                <div className="form-group">
                  <label>{i18n.t('Domain')}</label>
                  <Field name="domain" maxLength="1024" className={classTable.domain} placeholder={i18n.t('Please enter the domain.')}/>
                  {
                    errors.domain && isSubmitted && (
                      <div className="invalid-feedback">{errors.domain}</div>
                    )
                  }
                </div>
              </>
            )
          }

          <button disabled={this.state.$isApiProcessing} type="submit" className="btn btn-primary btn-block rounded-pill">
            {i18n.t('Done')}
          </button>
        </div>
      </Form>
    );
  };

  render() {
    const initialValue = store.get('$setup').https;

    return (
      <div className="page-setup-https bg-secondary">
        <div className="navbar primary">
          { !window.isNoBrand &&
          <img src={logo}/>}
        </div>
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-card">
              <Formik
                initialValues={initialValue}
                validate={this.generateValidator()}
                onSubmit={this.onSubmitSetupHTTPSForm}
              >
                {this.setupHTTPSFormRender}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
