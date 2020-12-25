const classNames = require('classnames');
const PropTypes = require('prop-types');
const React = require('react');
const progress = require('nprogress');
const {getRouter} = require('@benson.liao/capybara-router');
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
const ErrorDisplay = require('../../../core/components/error-display').default;

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
              {({values, setFieldValue}) => (
                <Form className="row">
                  <BreadCrumb
                    className="px-0"
                    path={[i18n.t('navigation.sidebar.videoSettings'), i18n.t('navigation.sidebar.osd')]}
                    routes={['/media/stream']}
                  />
                  <div className="col-7 px-0">
                    <div className="video-wrapper">
                      <img className="img-fluid" draggable={false} src="/api/snapshot"/>
                      {
                        [
                          {leftTop: 'top-left'},
                          {rightTop: 'top-right'},
                          {leftBottom: 'bottom-left'},
                          {rightBottom: 'bottom-right'}
                        ].map(direction => {
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
                      <div className="card-header">{i18n.t('video.osd.title')}</div>
                      <div className="card-body">
                        <div className="form-group d-flex justify-content-between align-items-center">
                          <label className="mb-0">{i18n.t('video.osd.enable')}</label>
                          <div className="custom-control custom-switch">
                            <Field name="isEnable" checked={values.isEnable} type="checkbox" className="custom-control-input" id="switch-function"/>
                            <label className="custom-control-label" htmlFor="switch-function">
                              <span>{i18n.t('common.button.on')}</span>
                              <span>{i18n.t('common.button.off')}</span>
                            </label>
                          </div>
                        </div>
                        <div className="form-group d-flex justify-content-between align-items-center">
                          <label className="mb-0">{i18n.t('video.osd.size')}</label>
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
                                  {(() => {
                                    switch (size) {
                                      default: return <ErrorDisplay/>;
                                      case OSDFontSize.small:
                                        return i18n.t('video.osd.constants.font-size-0');
                                      case OSDFontSize.medium:
                                        return i18n.t('video.osd.constants.font-size-1');
                                      case OSDFontSize.large:
                                        return i18n.t('video.osd.constants.font-size-2');
                                    }
                                  })()}
                                </button>
                              ))
                            }
                          </div>
                        </div>
                        <div className="form-group d-flex justify-content-between align-items-center">
                          <label className="mb-0">{i18n.t('video.osd.color')}</label>
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
                            <label className="mb-0">{i18n.t('video.osd.position')}</label>
                            {
                              [{
                                name: 'leftTop',
                                i18nMessage: i18n.t('video.osd.leftTop')
                              }, {
                                name: 'rightTop',
                                i18nMessage: i18n.t('video.osd.rightTop')
                              }, {
                                name: 'leftBottom',
                                i18nMessage: i18n.t('video.osd.leftBottom')
                              }, {
                                name: 'rightBottom',
                                i18nMessage: i18n.t('video.osd.rightBottom')
                              }].map(direction => (
                                values.position === OSDPosition[direction.name] && (
                                  <p key={direction.name} className="text-primary mb-0">{direction.i18nMessage}</p>
                                )
                              ))
                            }
                          </div>
                          <small className="mt-0 form-text text-muted">{i18n.t('video.osd.positionHelper')}</small>
                        </div>
                        <SelectField labelName={i18n.t('video.osd.overlay')} name="type">
                          {OSDType.all().map(type => (
                            <option key={type} value={type}>
                              {(() => {
                                switch (type) {
                                  default: return <ErrorDisplay/>;
                                  case OSDType.time:
                                    return i18n.t('video.osd.constants.osd-type-0');
                                  case OSDType.cameraName:
                                    return i18n.t('video.osd.constants.osd-type-1');
                                  case OSDType.cameraNameAndTime:
                                    return i18n.t('video.osd.constants.osd-type-2');
                                  case OSDType.custom:
                                    return i18n.t('video.osd.constants.osd-type-3');
                                }
                              })()}
                            </option>
                          ))}
                        </SelectField>
                        <div className={classNames('form-group', {'d-none': values.type !== OSDType.custom})}>
                          <Field
                            name="customText"
                            type="text"
                            placeholder={i18n.t('video.osd.enterCustomText')}
                            maxLength={OSDSettingsSchema.customText.max}
                            className="form-control"
                          />
                        </div>
                        <button disabled={this.state.$isApiProcessing} type="submit" className="btn btn-block btn-primary rounded-pill mt-5">
                          {i18n.t('common.button.apply')}
                        </button>
                      </div>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    );
  }
};
