const classNames = require('classnames');
const PropTypes = require('prop-types');
const React = require('react');
const progress = require('nprogress');
const {Link, getRouter} = require('capybara-router');
const {Formik, Form, Field} = require('formik');
const WordFontSize = require('webserver-form-schema/constants/word-font-size');
const WordColor = require('webserver-form-schema/constants/word-color');
const WordPosition = require('webserver-form-schema/constants/word-position');
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
        position: PropTypes.oneOf(WordPosition.all()).isRequired
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
                <Link to="/media/stream">{_('Multimedia settings')}</Link>
              </li>
              <li className="breadcrumb-item">{_('Text stickers')}</li>
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
            <div className="card-header">{_('Text stickers')}</div>
            <div className="card-body">
              <div className="form-group d-flex justify-content-between align-items-center">
                <label className="mb-0">{_('Function')}</label>
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
                  <span style={{whiteSpace: 'nowrap'}}>{_('Word')}</span><span style={{whiteSpace: 'nowrap'}}>{_('Size')}</span>
                </label>
                <div className="btn-group">
                  {
                    WordFontSize.all().map(size => (
                      <button key={size} type="button"
                        className={classNames('btn btn-sm btn-outline-success', {active: values.fontSize === size})}
                        onClick={() => setFieldValue('fontSize', size)}
                      >
                        {_(`font-size-${size}`)}
                      </button>
                    ))
                  }
                </div>
              </div>
              <div className="form-group d-flex justify-content-between align-items-center">
                <label className="mb-0">{_('Word color')}</label>
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
              <div className="form-group">
                <label>{_('Word position')}</label> <i className="fas fa-info-circle text-primary ml-2"/>
                <p className="text-primary">{_('Please click position buttons.')}</p>
              </div>
              <button disabled={this.state.$isApiProcessing} type="submit" className="btn btn-block btn-primary rounded-pill">
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
