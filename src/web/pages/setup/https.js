const classNames = require('classnames');
const React = require('react');
const {Link, getRouter} = require('capybara-router');
const {Formik, Form, Field} = require('formik');
const progress = require('nprogress');
const CertificateType = require('webserver-form-schema/constants/certificate-type');
const logo = require('../../../resource/logo-avc-secondary.svg');
const logoWithTitle = require('../../../resource/logo-avc-title.svg');
const setupStep03 = require('../../../resource/setup-step-03.png');
const setupStep03x2 = require('../../../resource/setup-step-03@2x.png');
const _ = require('../../../languages');
const Base = require('../shared/base');
const store = require('../../../core/store');
const utils = require('../../../core/utils');
const uploadCertificateValidator = require('../../validations/setup/https-upload-certificate-validator');
const generateCertificateValidator = require('../../validations/setup/https-generate-certificate-validator');
const api = require('../../../core/apis/web-api');

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
          <div className="steps">
            <div className="d-flex justify-content-between">
              <p className="text-primary">{_('Language')}</p>
              <p className="text-primary">{_('SETUP-Account')}</p>
              <p className="text-primary">{_('HTTPS')}</p>
            </div>
            <img src={setupStep03} srcSet={`${setupStep03x2} 2x`}/>
            <Link to="/setup/account" className="go-back"><i className="fas fa-chevron-left"/></Link>
          </div>
          <div className="form-group">
            <label>{_('Certificate type')}</label>
            <div className="select-wrapper border rounded-pill overflow-hidden px-2">
              <Field name="certificateType" component="select"
                className="form-control border-0"
                onChange={this.generateChangeCertificateTypeHandler(handleChange)}
              >
                <option value={CertificateType.selfSigned}>{_(`certificate-type-${CertificateType.selfSigned}`)}</option>
                <option value={CertificateType.uploadCertificate}>{_(`certificate-type-${CertificateType.uploadCertificate}`)}</option>
                <option value={CertificateType.generateCertificate}>{_(`certificate-type-${CertificateType.generateCertificate}`)}</option>
              </Field>
            </div>
            <small className="form-text text-muted">{_('SSL certificate.')}</small>
          </div>

          {
            /* Upload your certificate. */
            values.certificateType === CertificateType.uploadCertificate && (
              <>
                <div className="form-group">
                  <label>{_('Certificate')}</label>
                  <Field name="certificate" component="textarea" className={classTable.certificate} rows="5" maxLength="10240" placeholder="-----BEGIN CERTIFICATE-----"/>
                  {
                    errors.certificate && isSubmitted && (
                      <div className="invalid-feedback">{errors.certificate}</div>
                    )
                  }
                </div>
                <div className="form-group">
                  <label>{_('Private key')}</label>
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
                  <label>{_('Country name')}</label>
                  <Field name="country" maxLength="2" className={classTable.country} placeholder={_('Please enter the country code.')}/>
                  {
                    errors.country && isSubmitted && (
                      <div className="invalid-feedback">{errors.country}</div>
                    )
                  }
                  <small className="form-text text-muted">{_('Two letters.')}</small>
                </div>
                <div className="form-group">
                  <label>{_('State or province name')}</label>
                  <Field name="state" maxLength="1024" className={classTable.state} placeholder={_('Please enter the state or province name.')}/>
                  {
                    errors.state && isSubmitted && (
                      <div className="invalid-feedback">{errors.state}</div>
                    )
                  }
                </div>
                <div className="form-group">
                  <label>{_('City name')}</label>
                  <Field name="city" maxLength="1024" className={classTable.city} placeholder={_('Please enter the city name.')}/>
                  {
                    errors.city && isSubmitted && (
                      <div className="invalid-feedback">{errors.city}</div>
                    )
                  }
                </div>
                <div className="form-group">
                  <label>{_('Organization name')}</label>
                  <Field name="organization" maxLength="1024" className={classTable.organization} placeholder={_('Please enter the organization name.')}/>
                  {
                    errors.organization && isSubmitted && (
                      <div className="invalid-feedback">{errors.organization}</div>
                    )
                  }
                  <small className="form-text text-muted">{_('The company.')}</small>
                </div>
                <div className="form-group">
                  <label>{_('Organization unit name')}</label>
                  <Field name="organizationUnit" maxLength="1024" className={classTable.organizationUnit} placeholder={_('Please enter the organization unit name.')}/>
                  {
                    errors.organizationUnit && isSubmitted && (
                      <div className="invalid-feedback">{errors.organizationUnit}</div>
                    )
                  }
                </div>
                <div className="form-group">
                  <label>{_('Email address')}</label>
                  <Field name="email" maxLength="1024" className={classTable.email} placeholder={_('Please enter the email address.')}/>
                  {
                    errors.email && isSubmitted && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )
                  }
                </div>
                <div className="form-group">
                  <label>{_('Domain')}</label>
                  <Field name="domain" maxLength="1024" className={classTable.domain} placeholder={_('Please enter the domain.')}/>
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
            {_('Done')}
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
          <img src={logo}/>
        </div>
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-12 bg-white logo">
              <img src={logoWithTitle}/>
            </div>
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
