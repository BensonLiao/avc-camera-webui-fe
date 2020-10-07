const PropTypes = require('prop-types');
const React = require('react');
const {getRouter} = require('capybara-router');
const progress = require('nprogress');
const {Formik, Form, Field} = require('formik');
const AudioInputQuality = require('webserver-form-schema/constants/audio-input-quality');
const AudioInputSource = require('webserver-form-schema/constants/audio-input-source');
const Base = require('../shared/base');
const _ = require('../../../languages');
const api = require('../../../core/apis/web-api');
const SelectField = require('../../../core/components/fields/select-field');
const BreadCrumb = require('../../../core/components/fields/breadcrumb').default;

module.exports = class Audio extends Base {
  static get propTypes() {
    return {
      audioSettings: PropTypes.shape({
        isEnableInput: PropTypes.bool.isRequired,
        inputQuality: PropTypes.string.isRequired,
        inputSource: PropTypes.string.isRequired
      }).isRequired
    };
  }

  onSubmitAudioSettingsForm = values => {
    progress.start();
    api.multimedia.updateAudioSettings(values)
      .then(getRouter().reload)
      .finally(progress.done);
  };

  audioSettingsFormRender = ({values}) => {
    return (
      <Form className="card-body">
        <div className="form-group d-flex justify-content-between align-items-center">
          <label className="mb-0">{_('Audio In')}</label>
          <div className="custom-control custom-switch">
            <Field name="isEnableInput" checked={values.isEnableInput} type="checkbox" className="custom-control-input" id="switch-sound"/>
            <label className="custom-control-label" htmlFor="switch-sound">
              <span>{_('ON')}</span>
              <span>{_('OFF')}</span>
            </label>
          </div>
        </div>
        <SelectField readOnly labelName={_('Audio Quality')} name="inputQuality">
          <option value={AudioInputQuality.low}>{_(`audio-quality-${AudioInputQuality.low}`)}</option>
        </SelectField>
        <SelectField readOnly labelName={_('Input Source')} name="inputQuality">
          <option value={AudioInputSource.lineIn}>{_('External Microphone')}</option>
        </SelectField>
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
              <BreadCrumb
                className="px-0"
                path={[_('Audio')]}
              />
              <div className="col-center">
                <div className="card shadow">
                  <div className="card-header">{_('Audio Settings')}</div>
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
