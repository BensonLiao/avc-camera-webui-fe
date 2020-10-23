const classNames = require('classnames');
const PropTypes = require('prop-types');
const React = require('react');
const progress = require('nprogress');
const {getRouter} = require('capybara-router');
const {Formik, Form, Field} = require('formik');
const WordFontSize = require('webserver-form-schema/constants/word-font-size');
const WordColor = require('webserver-form-schema/constants/word-color');
const WordPosition = require('webserver-form-schema/constants/word-position');
const WordType = require('webserver-form-schema/constants/word-type');
const WordSettingsSchema = require('webserver-form-schema/word-settings-schema');
const Base = require('../shared/base');
const i18n = require('../../../i18n').default;
const api = require('../../../core/apis/web-api');
const SelectField = require('../../../core/components/fields/select-field');
const BreadCrumb = require('../../../core/components/fields/breadcrumb').default;

module.exports = class Word extends Base {
  static get propTypes() {
    return {
      wordSettings: PropTypes.shape({
        isEnable: PropTypes.bool.isRequired,
        fontSize: PropTypes.oneOf(WordFontSize.all()).isRequired,
        color: PropTypes.oneOf(WordColor.all()).isRequired,
        position: PropTypes.oneOf(WordPosition.all()).isRequired,
        type: PropTypes.oneOf(WordType.all()).isRequired,
        customText: PropTypes.string
      }).isRequired
    };
  }

  generatePositionButtonHandler = (form, position) => event => {
    event.preventDefault();
    form.setFieldValue('position', position);
  };

  onSubmitWordSettingsForm = values => {
    progress.start();
    api.multimedia.updateWordSettings(values)
      .then(getRouter().reload)
      .finally(progress.done);
  };

  wordSettingsFormRender = form => {
    const {values, setFieldValue} = form;

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
              values.position !== WordPosition.leftTop && (
                <button
                  className="btn btn-top-left"
                  type="button"
                  onClick={this.generatePositionButtonHandler(form, WordPosition.leftTop)}
                >
                  <i className="fas fa-arrow-up"/>
                </button>
              )
            }
            {
              values.position !== WordPosition.rightTop && (
                <button
                  className="btn btn-top-right"
                  type="button"
                  onClick={this.generatePositionButtonHandler(form, WordPosition.rightTop)}
                >
                  <i className="fas fa-arrow-up"/>
                </button>
              )
            }
            {
              values.position !== WordPosition.leftBottom && (
                <button
                  className="btn btn-bottom-left"
                  type="button"
                  onClick={this.generatePositionButtonHandler(form, WordPosition.leftBottom)}
                >
                  <i className="fas fa-arrow-up"/>
                </button>
              )
            }
            {
              values.position !== WordPosition.rightBottom && (
                <button
                  className="btn btn-bottom-right"
                  type="button"
                  onClick={this.generatePositionButtonHandler(form, WordPosition.rightBottom)}
                >
                  <i className="fas fa-arrow-up"/>
                </button>
              )
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
                    WordFontSize.all().map(size => (
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
                      {active: values.color === WordColor.black}
                    )}
                    onClick={() => setFieldValue('color', WordColor.black)}
                  >
                    &nbsp;
                  </button>
                  &nbsp;
                  <button
                    type="button"
                    className={classNames(
                      'btn-white',
                      {active: values.color === WordColor.white}
                    )}
                    onClick={() => setFieldValue('color', WordColor.white)}
                  >
                    &nbsp;
                  </button>
                </div>
              </div>
              <div className="form-group">
                <div className="form-group d-flex justify-content-between align-items-center mb-0">
                  <label className="mb-0">{i18n.t('Position')}</label>
                  {
                    values.position === WordPosition.leftTop && (
                      <p className="text-primary mb-0">{i18n.t('Left Top')}</p>
                    )
                  }
                  {
                    values.position === WordPosition.rightTop && (
                      <p className="text-primary mb-0">{i18n.t('Right Top')}</p>
                    )
                  }
                  {
                    values.position === WordPosition.leftBottom && (
                      <p className="text-primary mb-0">{i18n.t('Left Bottom')}</p>
                    )
                  }
                  {
                    values.position === WordPosition.rightBottom && (
                      <p className="text-primary mb-0">{i18n.t('Right Bottom')}</p>
                    )
                  }
                </div>
                <small className="mt-0 form-text text-muted">{i18n.t('Click the arrow on the preview window.')}</small>
              </div>
              <SelectField labelName={i18n.t('Text Overlay')} name="type">
                {WordType.all().map(type => (
                  <option key={type} value={type}>{i18n.t(`word-type-${type}`)}</option>
                ))}
              </SelectField>
              <div className={classNames('form-group', {'d-none': values.type !== WordType.custom})}>
                <Field
                  name="customText"
                  type="text"
                  placeholder={i18n.t('Enter custom text')}
                  maxLength={WordSettingsSchema.customText.max}
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
  };

  render() {
    const {wordSettings} = this.props;

    wordSettings.customText = wordSettings.customText || '';
    return (
      <div className="main-content left-menu-active">
        <div className="section-media">
          <div className="container-fluid">
            <Formik initialValues={wordSettings} onSubmit={this.onSubmitWordSettingsForm}>
              {this.wordSettingsFormRender}
            </Formik>
          </div>
        </div>
      </div>
    );
  }
};
