const classNames = require('classnames');
const PropTypes = require('prop-types');
const React = require('react');
const progress = require('nprogress');
const {getRouter} = require('capybara-router');
const {Formik, Form, Field} = require('formik');
const OSDFontSize = require('webserver-form-schema/constants/osd-font-size');
const OSDColor = require('webserver-form-schema/constants/osd-color');
const OSDPosition = require('webserver-form-schema/constants/osd-position');
const OSDType = require('webserver-form-schema/constants/osd-type');
const OSDSettingsSchema = require('webserver-form-schema/osd-settings-schema');
const Base = require('../shared/base');
const i18n = require('../../../i18n').default;
const api = require('../../../core/apis/web-api');
const SelectField = require('../../../core/components/fields/select-field');
const BreadCrumb = require('../../../core/components/fields/breadcrumb').default;

module.exports = class OSD extends Base {
  static get propTypes() {
    return {
      osdSettings: PropTypes.shape({
        isEnable: PropTypes.bool.isRequired,
        fontSize: PropTypes.oneOf(OSDFontSize.all()).isRequired,
        color: PropTypes.oneOf(OSDColor.all()).isRequired,
        position: PropTypes.oneOf(OSDPosition.all()).isRequired,
        type: PropTypes.oneOf(OSDType.all()).isRequired,
        customText: PropTypes.string
      }).isRequired
    };
  }

  generatePositionButtonHandler = (setFieldValue, position) => event => {
    event.preventDefault();
    setFieldValue('position', position);
  };

  onSubmitOSDSettingsForm = values => {
    progress.start();
    api.multimedia.updateOSDSettings(values)
      .then(getRouter().reload)
      .finally(progress.done);
  };

  render() {
    const {osdSettings} = this.props;

    osdSettings.customText = osdSettings.customText || '';
    return (
      <div className="main-content left-menu-active">
        <div className="section-media">
          <div className="container-fluid">
            <Formik initialValues={osdSettings} onSubmit={this.onSubmitOSDSettingsForm}>
              {({values, setFieldValue}) => {
                return (
                  <Form className="row">
                    <BreadCrumb
                      className="px-0"
                      path={[i18n.t('Video Settings'), i18n.t('OSD')]}
                      routes={['/media/stream']}
                    />
                    <div className="col-7 px-0">
                      <div className="video-wrapper">
                        <img className="img-fluid" draggable={false} src="/api/snapshot"/>
                        {
                          [{leftTop: 'top-left'}, {rightTop: 'top-right'}, {leftBottom: 'bottom-left'}, {rightBottom: 'bottom-right'}].map(direction => {
                            const [key, value] = Object.entries(direction)[0];
                            return (
                              values.position !== OSDPosition[key] && (
                                <button
                                  key={key}
                                  className={`btn btn-${value}`}
                                  type="button"
                                  onClick={this.generatePositionButtonHandler(setFieldValue, OSDPosition[key])}
                                >
                                  <i className="fas fa-arrow-up"/>
                                </button>
                              )
                            );
                          })
                        }
                      </div>
                    </div>
                    <div className="col-5 pl-4 pr-0">
                      <div className="card shadow">
                        <div className="card-header">{i18n.t('OSD')}</div>
                        <div className="card-body">
                          <div className="form-group d-flex justify-content-between align-items-center">
                            <label className="mb-0">{i18n.t('Enable On-Screen Display')}</label>
                            <div className="custom-control custom-switch">
                              <Field name="isEnable" checked={values.isEnable} type="checkbox" className="custom-control-input" id="switch-function"/>
                              <label className="custom-control-label" htmlFor="switch-function">
                                <span>{i18n.t('ON')}</span>
                                <span>{i18n.t('OFF')}</span>
                              </label>
                            </div>
                          </div>
                          <div className="form-group d-flex justify-content-between align-items-center">
                            <label className="mb-0">{i18n.t('Size')}</label>
                            <div className="btn-group">
                              {
                                OSDFontSize.all().map(size => (
                                  <button
                                    key={size}
                                    type="button"
                                    className={classNames(
                                      'btn triple-wrapper btn-sm outline-success px-2 py-1',
                                      {active: values.fontSize === size}
                                    )}
                                    onClick={() => setFieldValue('fontSize', size)}
                                  >
                                    {i18n.t(`font-size-${size}`)}
                                  </button>
                                ))
                              }
                            </div>
                          </div>
                          <div className="form-group d-flex justify-content-between align-items-center">
                            <label className="mb-0">{i18n.t('Color')}</label>
                            <div>
                              <button
                                type="button"
                                className={classNames(
                                  'btn-black',
                                  {active: values.color === OSDColor.black}
                                )}
                                onClick={() => setFieldValue('color', OSDColor.black)}
                              >
                                &nbsp;
                              </button>
                              &nbsp;
                              <button
                                type="button"
                                className={classNames(
                                  'btn-white',
                                  {active: values.color === OSDColor.white}
                                )}
                                onClick={() => setFieldValue('color', OSDColor.white)}
                              >
                                &nbsp;
                              </button>
                            </div>
                          </div>
                          <div className="form-group">
                            <div className="form-group d-flex justify-content-between align-items-center mb-0">
                              <label className="mb-0">{i18n.t('Position')}</label>
                              {
                                [{leftTop: 'Left Top'}, {rightTop: 'Right Top'}, {leftBottom: 'Bottom Left'}, {rightBottom: 'Bottom Right'}].map(direction => {
                                  const [key, value] = Object.entries(direction)[0];
                                  return (
                                    values.position === OSDPosition[key] && (
                                      <p key={value} className="text-primary mb-0">{i18n.t(value)}</p>
                                    )
                                  );
                                })
                              }
                            </div>
                            <small className="mt-0 form-text text-muted">{i18n.t('Click the arrow on the live view screen.')}</small>
                          </div>
                          <SelectField labelName={i18n.t('Text Overlay')} name="type">
                            {OSDType.all().map(type => (
                              <option key={type} value={type}>{i18n.t(`osd-type-${type}`)}</option>
                            ))}
                          </SelectField>
                          <div className={classNames('form-group', {'d-none': values.type !== OSDType.custom})}>
                            <Field
                              name="customText"
                              type="text"
                              placeholder={i18n.t('Enter custom text')}
                              maxLength={OSDSettingsSchema.customText.max}
                              className="form-control"
                            />
                          </div>
                          <button disabled={this.state.$isApiProcessing} type="submit" className="btn btn-block btn-primary rounded-pill mt-5">
                            {i18n.t('Apply')}
                          </button>
                        </div>
                      </div>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
      </div>
    );
  }
};
