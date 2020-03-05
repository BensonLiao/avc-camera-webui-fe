const classNames = require('classnames');
const PropTypes = require('prop-types');
const React = require('react');
const progress = require('nprogress');
const {Link, getRouter} = require('capybara-router');
const {Formik, Form, Field} = require('formik');
const WordFontSize = require('webserver-form-schema/constants/word-font-size');
const WordColor = require('webserver-form-schema/constants/word-color');
const WordPosition = require('webserver-form-schema/constants/word-position');
const WordType = require('webserver-form-schema/constants/word-type');
const WordSettingsSchema = require('webserver-form-schema/word-settings-schema');
const Base = require('../shared/base');
const _ = require('../../../languages');
const utils = require('../../../core/utils');
const api = require('../../../core/apis/web-api');

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
      .catch(error => {
        progress.done();
        utils.renderError(error);
      });
  };

  wordSettingsFormRender = form => {
    const {values, setFieldValue} = form;

    return (
      <Form className="row">
        <div className="col-12">
          <nav>
            <ol className="breadcrumb rounded-pill">
              <li className="breadcrumb-item active">
                <Link to="/media/stream">{_('Video')}</Link>
              </li>
              <li className="breadcrumb-item">{_('OSD')}</li>
            </ol>
          </nav>
        </div>

        <div className="col-8 pr-24">
          <div className="video-wrapper">
            <img className="img-fluid" src="/api/snapshot"/>
            {
              values.position !== WordPosition.leftTop && (
                <button className="btn btn-top-left" type="button"
                  onClick={this.generatePositionButtonHandler(form, WordPosition.leftTop)}
                >
                  <i className="fas fa-arrow-up"/>
                </button>
              )
            }
            {
              values.position !== WordPosition.rightTop && (
                <button className="btn btn-top-right" type="button"
                  onClick={this.generatePositionButtonHandler(form, WordPosition.rightTop)}
                >
                  <i className="fas fa-arrow-up"/>
                </button>
              )
            }
            {
              values.position !== WordPosition.leftBottom && (
                <button className="btn btn-bottom-left" type="button"
                  onClick={this.generatePositionButtonHandler(form, WordPosition.leftBottom)}
                >
                  <i className="fas fa-arrow-up"/>
                </button>
              )
            }
            {
              values.position !== WordPosition.rightBottom && (
                <button className="btn btn-bottom-right" type="button"
                  onClick={this.generatePositionButtonHandler(form, WordPosition.rightBottom)}
                >
                  <i className="fas fa-arrow-up"/>
                </button>
              )
            }
          </div>
        </div>

        <div className="col-4 pl-24">
          <div className="card shadow">
            <div className="card-header">{_('OSD')}</div>
            <div className="card-body">
              <div className="form-group d-flex justify-content-between align-items-center">
                <label className="mb-0">{_('On/Off')}</label>
                <div className="custom-control custom-switch">
                  <Field name="isEnable" checked={values.isEnable} type="checkbox" className="custom-control-input" id="switch-function"/>
                  <label className="custom-control-label" htmlFor="switch-function">
                    <span>{_('ON')}</span>
                    <span>{_('OFF')}</span>
                  </label>
                </div>
              </div>
              <div className="form-group d-flex justify-content-between align-items-center">
                <label className="mb-0">
                  <span style={{whiteSpace: 'nowrap'}}>{_('Size')}</span>
                </label>
                <div className="btn-group">
                  {
                    WordFontSize.all().map(size => (
                      <button key={size} type="button"
                        className={classNames('btn btn-sm btn-outline-success px-2 py-1', {active: values.fontSize === size})}
                        onClick={() => setFieldValue('fontSize', size)}
                      >
                        {_(`font-size-${size}`)}
                      </button>
                    ))
                  }
                </div>
              </div>
              <div className="form-group d-flex justify-content-between align-items-center">
                <label className="mb-0">{_('Color')}</label>
                <div>
                  <button type="button" className="border btn-black"
                    onClick={() => setFieldValue('color', WordColor.black)}
                  >
                    &nbsp;
                  </button>
                  <button type="button" className="border btn-white"
                    onClick={() => setFieldValue('color', WordColor.white)}
                  >
                    &nbsp;
                  </button>
                </div>
              </div>
              <div className={classNames('form-group', {'d-none': values.type !== WordType.custom})}>
                <Field name="customText" type="text" maxLength={WordSettingsSchema.customText.max} className="form-control"/>
              </div>
              <div className="form-group">
                <label>{_('Position')}</label> <i className="fas fa-info-circle text-primary ml-2"/>
                <p className="text-primary">{_('Please click position buttons.')}</p>
              </div>
              <div className="form-group">
                <label>{_('Text Overlay')}</label>
                <div className="select-wrapper border rounded-pill overflow-hidden">
                  <Field
                    name="type"
                    component="select"
                    className="form-control border-0"
                  >
                    {
                      WordType.all().map(type => (
                        <option key={type} value={type}>{_(`word-type-${type}`)}</option>
                      ))
                    }
                  </Field>
                </div>
              </div>
              <button disabled={this.state.$isApiProcessing} type="submit" className="btn btn-block btn-primary rounded-pill mt-5">
                {_('Apply')}
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
