const PropTypes = require('prop-types');
const React = require('react');
const {getRouter} = require('@benson.liao/capybara-router');
const progress = require('nprogress');
const {Formik, Form, Field} = require('formik');
const AudioInputQuality = require('webserver-form-schema/constants/audio-input-quality');
const AudioInputSource = require('webserver-form-schema/constants/audio-input-source');
const Base = require('../shared/base');
const i18n = require('../../../i18n').default;
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
          <label className="mb-0">{i18n.t('audio.enable')}</label>
          <div className="custom-control custom-switch">
            <Field name="isEnableInput" checked={values.isEnableInput} type="checkbox" className="custom-control-input" id="switch-sound"/>
            <label className="custom-control-label" htmlFor="switch-sound">
              <span>{i18n.t('common.button.on')}</span>
              <span>{i18n.t('common.button.off')}</span>
            </label>
          </div>
        </div>
        <SelectField readOnly labelName={i18n.t('audio.quality')} name="inputQuality">
          <option value={AudioInputQuality.low}>{i18n.t('audio.constants.audio-quality-0')}</option>
        </SelectField>
        <SelectField readOnly labelName={i18n.t('audio.inputSource')} name="inputQuality">
          <option value={AudioInputSource.lineIn}>{i18n.t('audio.externalMicrophone')}</option>
        </SelectField>
        <button disabled={this.state.$isApiProcessing} type="submit" className="btn btn-block btn-primary rounded-pill mt-5">
          {i18n.t('common.button.apply')}
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
                path={[i18n.t('navigation.sidebar.audio')]}
              />
              <div className="col-center">
                <div className="card shadow">
                  <div className="card-header">{i18n.t('audio.title')}</div>
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
