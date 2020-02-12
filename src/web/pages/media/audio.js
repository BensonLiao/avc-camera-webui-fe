const PropTypes = require('prop-types');
const React = require('react');
const {getRouter} = require('capybara-router');
const progress = require('nprogress');
const {Formik, Form, Field} = require('formik');
const AudioInputQuality = require('webserver-form-schema/constants/audio-input-quality');
const AudioInputSource = require('webserver-form-schema/constants/audio-input-source');
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
      <Form className="card-body">
        <div className="form-group d-flex justify-content-between align-items-center">
          <label className="mb-0">{_('Audio')}</label>
          <div className="custom-control custom-switch">
            <Field name="isEnableInput" checked={values.isEnableInput} type="checkbox" className="custom-control-input" id="switch-sound"/>
            <label className="custom-control-label" htmlFor="switch-sound">
              <span>{_('ON')}</span>
              <span>{_('OFF')}</span>
            </label>
          </div>
        </div>
        <div className="form-group">
          <label>{_('Audio quality')}</label>
          <div className="select-wrapper border rounded-pill overflow-hidden">
            <Field name="inputQuality" component="select" className="form-control border-0">
              {
                AudioInputQuality.all().map(quality => (
                  <option key={quality} value={quality}>{_(`audio-quality-${quality}`)}</option>
                ))
              }
            </Field>
          </div>
        </div>
        <div className="form-group">
          <label>{_('Audio input source')}</label>
          <div className="select-wrapper border rounded-pill overflow-hidden">
            <Field name="inputSource" component="select" className="form-control border-0">
              <option value={AudioInputSource.lineIn}>{_('Built-in microphone')}</option>
            </Field>
          </div>
        </div>
        <div className="form-group d-flex justify-content-between align-items-center">
          <label className="mb-0">{_('Sound output')}</label>
          <div className="custom-control custom-switch">
            <Field name="isEnableOutput" checked={values.isEnableOutput} type="checkbox" className="custom-control-input" id="switch-output"/>
            <label className="custom-control-label" htmlFor="switch-output">
              <span>{_('ON')}</span>
              <span>{_('OFF')}</span>
            </label>
          </div>
        </div>
        <button disabled={this.state.$isApiProcessing} type="submit" className="btn btn-block btn-primary rounded-pill">
          {_('Apply')}
        </button>
      </Form>
    );
  };

  render() {
    const {audioSettings} = this.props;

    return (
      <div className="main-content">
        <div className="section-audio">
          <div className="container-fluid">
            <div className="row justify-content-center">
              <div className="col-12 px-0">
                <nav>
                  <ol className="breadcrumb rounded-pill">
                    <li className="breadcrumb-item">{_('Audio settings')}</li>
                  </ol>
                </nav>
              </div>

              <div className="col-card">
                <div className="card shadow">
                  <div className="card-header">{_('Audio settings')}</div>
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
