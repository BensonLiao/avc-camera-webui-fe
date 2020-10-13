const React = require('react');
const {getRouter} = require('capybara-router');
const progress = require('nprogress');
const logo = require('../../../resource/logo-avc-secondary.svg');
const setupStep01 = require('../../../resource/setup-step-01.png');
const setupStep01x2 = require('../../../resource/setup-step-01@2x.png');
const i18n = require('../../i18n').default;
const Base = require('../shared/base');
const store = require('../../../core/store');
const utils = require('../../../core/utils');
const ProgressBar = require('./progress-bar').default;

module.exports = class SetupLanguage extends Base {
  constructor() {
    super();
    this.state.languageCode = store.get('$setup').language;
  }

  onChangeLanguage = event => {
    event.preventDefault();
    progress.start();
    utils.setDefaultLanguage(event.target.value);
    location.reload();
  }

  onSubmit = values => {
    const $setup = store.get('$setup');
    $setup.language = values.language;
    store.set('$setup', $setup);
    getRouter().go('/setup/account');
  };

  render() {
    return (
      <div className="page-setup-language bg-secondary">
        <div className="navbar primary">
          { !window.isNoBrand &&
          <img src={logo}/>}
        </div>
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-card">
              <form className="card shadow mb-5">
                <div className="card-body">
                  <ProgressBar
                    hasPreviousPage={false}
                    step={1}
                    progressBarImage={setupStep01}
                    progressBarImagex2={setupStep01x2}
                  />
                  <div className="form-group">
                    <div className="select-wrapper border rounded-pill overflow-hidden px-2">
                      <select name="language" value={window.currentLanguageCode} className="form-control border-0" onChange={this.onChangeLanguage}>
                        {
                          Object.keys(window.config.languages).map(languageCode => (
                            <option key={languageCode} value={languageCode}>
                              {window.config.languages[languageCode].title}
                            </option>
                          ))
                        }
                      </select>
                    </div>
                  </div>

                  <button disabled={this.state.$isApiProcessing} type="submit" className="btn btn-primary btn-block rounded-pill" onClick={this.onSubmit}>
                    {i18n.t('Next')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
