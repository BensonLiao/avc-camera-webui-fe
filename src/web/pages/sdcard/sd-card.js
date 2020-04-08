const PropTypes = require('prop-types');
const React = require('react');
const {getRouter} = require('capybara-router');
const progress = require('nprogress');
const {Formik, Form, Field} = require('formik');
const Base = require('../shared/base');
const utils = require('../../../core/utils');
const _ = require('../../../languages');
const api = require('../../../core/apis/web-api');

module.exports = class Audio extends Base {
  static get propTypes() {
    return {
      audioSettings: PropTypes.shape({
        isEnableInput: PropTypes.bool.isRequired,
        isEnableOutput: PropTypes.bool.isRequired,
        inputQuality: PropTypes.string.isRequired,
        inputSource: PropTypes.string.isRequired
      }).isRequired
    };
  }

  onSubmitAudioSettingsForm = values => {
    progress.start();
    api.multimedia.updateAudioSettings(values)
      .then(getRouter().reload)
      .catch(error => {
        progress.done();
        utils.renderError(error);
      });
  };

  audioSettingsFormRender = ({values}) => {
    return (
      <Form className="card-body sdcard">
        <div className="form-group d-flex justify-content-between align-items-center">
          <label className="mb-0">{_('SD Card')}</label>
          <div className="custom-control custom-switch">
            <Field name="isEnableInput" checked={values.isEnableInput} type="checkbox" className="custom-control-input" id="switch-sound"/>
            <label className="custom-control-label" htmlFor="switch-sound">
              <span>{_('ON')}</span>
              <span>{_('OFF')}</span>
            </label>
          </div>
        </div>
        <div className="form-group">
          <div className="card">
            <div className="card-body">
              <label>{_('SD Card Operation')}</label>
              <div>
                <span>
                  <button className="btn btn-outline-primary rounded-pill px-5 mr-3" type="button" onClick={this.showModal}>
                    {_('Format')}
                  </button>
                </span>
                <span>
                  <button className="btn btn-outline-primary rounded-pill px-5" type="button" onClick={this.showModal}>
                    {_('Uninstall')}
                  </button>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="form-group">
          <div className="card">
            <div className="card-body">
              <div className="form-group d-flex justify-content-between align-items-center mb-0">
                <label className="mb-0">{_('Notification')}</label>
                <div className="custom-control custom-switch">
                  <Field name="isEnableOutput" checked={values.isEnableOutput} type="checkbox" className="custom-control-input" id="switch-output"/>
                  <label className="custom-control-label" htmlFor="switch-output">
                    <span>{_('ON')}</span>
                    <span>{_('OFF')}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button disabled={this.state.$isApiProcessing} type="submit" className="btn btn-block btn-primary rounded-pill mt-5">
          {_('Apply')}
        </button>
      </Form>
    );
  };

  render() {
    const {audioSettings} = this.props;

    return (
      <div className="main-content">
        <div className="section-media">
          <div className="container-fluid">
            <div className="row justify-content-center">
              <div className="col-12 px-0">
                <nav>
                  <ol className="breadcrumb rounded-pill">
                    <li className="breadcrumb-item">{_('SD Card')}</li>
                  </ol>
                </nav>
              </div>

              <div className="col-center">
                <div className="card shadow">
                  <div className="card-header">{_('SD Card Settings')}</div>
                  <Formik
                    initialValues={audioSettings}
                    onSubmit={this.onSubmitAudioSettingsForm}
                  >
                    {this.audioSettingsFormRender}
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
