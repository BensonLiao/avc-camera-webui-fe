const classNames = require('classnames');
const PropTypes = require('prop-types');
const React = require('react');
const {Link, getRouter} = require('capybara-router');
const progress = require('nprogress');
const {Formik, Form, Field} = require('formik');
const CertificateType = require('webserver-form-schema/constants/certificate-type');
const HTTPSSelfSignedSettingsValidator = require('../../validations/system/https-self-signed-settings-validator');
const HTTPSUploadCertificateValidator = require('../../validations/system/https-upload-certificate-settings-validator');
const Base = require('../shared/base');
const _ = require('../../../languages');
const utils = require('../../../core/utils');
const api = require('../../../core/apis/web-api');

module.exports = class HTTPS extends Base {
  static get propTypes() {
    return {
      httpsSettings: PropTypes.shape({
        isEnable: PropTypes.bool.isRequired,
        port: PropTypes.string.isRequired,
        certificateType: PropTypes.oneOf(CertificateType.all()).isRequired
      }).isRequired
    };
  }

  constructor(props) {
    super(props);
    this.state.validator = this.generateValidator(props.httpsSettings.certificateType);
  }

  generateValidator = certificateType => {
    switch (certificateType) {
      case CertificateType.selfSigned:
        return utils.makeFormikValidator(HTTPSSelfSignedSettingsValidator);
      case CertificateType.uploadCertificate:
        return utils.makeFormikValidator(HTTPSUploadCertificateValidator);
      default:
        throw new Error('certificate type failed');
    }
  };

  checkValidatePort = values => {
    return utils.validatedPortCheck(
      values,
      _('Not a valid port number, please use another number.')
    );
  }

  onSubmitForm = values => {
    progress.start();
    api.system.updateHttpsSettings(values)
      .then(getRouter().reload)
      .catch(error => {
        progress.done();
        utils.renderError(error);
      });
  };

  certificateTypeRender = ({field}) => {
    const onChange = event => {
      this.setState({validator: this.generateValidator(event.target.value)});
      field.onChange(event);
    };

    return (
      <select {...field} className="form-control border-0" onChange={onChange}>
        <option value={CertificateType.selfSigned}>{_(`certificate-type-${CertificateType.selfSigned}`)}</option>
      </select>
    );
  };

  formRender = ({values, errors, touched}) => {
    const {$isApiProcessing} = this.state;

    return (
      <Form className="card-body">
        <div className="form-group d-flex justify-content-between align-items-center">
          <label>HTTPS</label>
          <div className="custom-control custom-switch">
            <Field name="isEnable" checked={values.isEnable} type="checkbox" className="custom-control-input" id="switch-enable"/>
            <label className="custom-control-label" htmlFor="switch-enable">
              <span>{_('ON')}</span>
              <span>{_('OFF')}</span>
            </label>
          </div>
        </div>
        <div className="form-group">
          <label>{_('Port')}</label>
          <Field
            name="port"
            type="text"
            validate={this.checkValidatePort}
            className={classNames('form-control', {'is-invalid': errors.port && touched.port})}/>
          {
            errors.port && touched.port && (
              <div className="invalid-feedback">{errors.port}</div>
            )
          }
        </div>
        <div className="form-group">
          <label>{_('Certificate')}</label>
          <div className="select-wrapper border rounded-pill overflow-hidden">
            <Field name="certificateType" component={this.certificateTypeRender}/>
          </div>
        </div>
        {
          values.certificateType === CertificateType.uploadCertificate && (
            <>
              <div className="form-group">
                <label>{_('Certificate')}</label>
                <Field name="certificate" component="textarea" rows={5}
                  className={classNames('form-control', {'is-invalid': errors.certificate && touched.certificate})}/>
                {
                  errors.certificate && touched.certificate && (
                    <div className="invalid-feedback">{errors.certificate}</div>
                  )
                }
              </div>
              <div className="form-group">
                <label>{_('Private Key')}</label>
                <Field name="privateKey" component="textarea" rows={5}
                  className={classNames('form-control', {'is-invalid': errors.privateKey && touched.privateKey})}/>
                {
                  errors.privateKey && touched.privateKey && (
                    <div className="invalid-feedback">{errors.privateKey}</div>
                  )
                }
              </div>
            </>
          )
        }
        <button disabled={$isApiProcessing || !utils.isObjectEmpty(errors)} className="btn btn-primary btn-block rounded-pill" type="submit">
          {_('Apply')}
        </button>
      </Form>
    );
  };

  render() {
    const {httpsSettings} = this.props;
    const {validator} = this.state;
    const initialValues = {
      ...httpsSettings,
      certificate: '',
      privateKey: ''
    };

    return (
      <div className="main-content left-menu-active">
        <div className="section-media">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12 px-0">
                <nav>
                  <ol className="breadcrumb rounded-pill">
                    <li className="breadcrumb-item active">
                      <Link to="/network/https">{_('Network')}</Link>
                    </li>
                    <li className="breadcrumb-item">HTTPS</li>
                  </ol>
                </nav>
              </div>

              <div className="col-center">
                <div className="card shadow">
                  <div className="card-header">HTTPS</div>
                  <Formik
                    initialValues={initialValues}
                    validate={validator}
                    onSubmit={this.onSubmitForm}
                  >
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
