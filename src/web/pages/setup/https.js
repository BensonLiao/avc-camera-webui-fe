const classNames = require('classnames');
const React = require('react');
const {Link} = require('capybara-router');
const {Formik, Form, Field} = require('formik');
const logo = require('webserver-prototype/src/resource/logo-01.svg');
const decoration = require('webserver-prototype/src/resource/decoration-01.svg');
const setupStep03 = require('webserver-prototype/src/resource/setup-step-03.png');
const setupStep03x2 = require('webserver-prototype/src/resource/setup-step-03@2x.png');
const _ = require('../../../languages');
const Base = require('../shared/base');
const store = require('../../../core/store');
const Dropdown = require('../../../core/components/dropdown');
const uploadCertificateSchema = require('../../validations/setup/https-upload-certificate-schema');
const generateCertificateSchema = require('../../validations/setup/https-generate-certificate-schema');

module.exports = class SetupHTTPS extends Base {
  constructor(props) {
    super(props);
    this.state.certificateType = store.get('$setup').https.certificateType;

    this.generateValidationSchema = this.generateValidationSchema.bind(this);
    this.onChangeCertificateType = this.onChangeCertificateType.bind(this);
    this.setupHTTPSFormRender = this.setupHTTPSFormRender.bind(this);
    this.onSubmitSetupHTTPSForm = this.onSubmitSetupHTTPSForm.bind(this);
  }

  generateValidationSchema() {
    switch (this.state.certificateType) {
      case 'upload-certificate':
        return uploadCertificateSchema;
      case 'generate-certificate':
        return generateCertificateSchema;
      default:
        return null;
    }
  }

  onChangeCertificateType(event, value) {
    this.setState({certificateType: value});
  }

  onSubmitSetupHTTPSForm(values) {
    /*
    @param values {Object}
      */
    console.log(values); // Debug
    const $setup = store.get('$setup');
    $setup.account = values;
    store.set('$setup', $setup);
  }

  setupHTTPSFormRender({errors, submitCount, values}) {
    const isSubmitted = submitCount > 0;
    const classTable = {
      certificate: classNames([
        'form-control', {'is-invalid': errors.certificate && isSubmitted}
      ]),
      privateKey: classNames([
        'form-control', {'is-invalid': errors.privateKey && isSubmitted}
      ]),
      country: classNames([
        'form-control', {'is-invalid': errors.country && isSubmitted}
      ]),
      state: classNames([
        'form-control', {'is-invalid': errors.state && isSubmitted}
      ]),
      city: classNames([
        'form-control', {'is-invalid': errors.city && isSubmitted}
      ]),
      organization: classNames([
        'form-control', {'is-invalid': errors.organization && isSubmitted}
      ]),
      organizationUnit: classNames([
        'form-control', {'is-invalid': errors.organizationUnit && isSubmitted}
      ]),
      email: classNames([
        'form-control', {'is-invalid': errors.email && isSubmitted}
      ]),
      domain: classNames([
        'form-control', {'is-invalid': errors.domain && isSubmitted}
      ])
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
            <Field component={Dropdown} name="certificateType"
              buttonClassName="btn-block rounded-pill d-flex justify-content-between align-items-center"
              items={[
                {value: 'self-signed', label: _('AndroVideo self-signed')},
                {value: 'upload-certificate', label: _('Upload certificate')},
                {value: 'generate-certificate', label: _('Generate certificate on this device')}
              ]}
              onChange={this.onChangeCertificateType}
            />
            <small className="form-text text-muted">{_('SSL certificate.')}</small>
          </div>

          {
            /* Upload your certificate. */
            values.certificateType === 'upload-certificate' && (
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
            values.certificateType === 'generate-certificate' && (
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

          <button type="submit" className="btn btn-primary btn-block rounded-pill">
            {_('Done')}
          </button>
        </div>
      </Form>
    );
  }

  render() {
    const initialValue = store.get('$setup').https;

    return (
      <div className="page-setup-https">
        <img src={logo} className="logo" alt="AndroVideo"/>
        <img src={decoration} className="decoration"/>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-card">
              <Formik
                initialValues={initialValue}
                validationSchema={this.generateValidationSchema}
                render={this.setupHTTPSFormRender}
                onSubmit={this.onSubmitSetupHTTPSForm}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
