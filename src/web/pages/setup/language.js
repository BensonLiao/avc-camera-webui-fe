const React = require('react');
const {getRouter} = require('capybara-router');
const progress = require('nprogress');
const logo = require('../../../resource/logo-avc-secondary.svg');
const setupStep01 = require('../../../resource/setup-step-01.png');
const i18n = require('../../../i18n').default;

const Base = require('../shared/base');
const store = require('../../../core/store');
const utils = require('../../../core/utils');
const ProgressBar = require('./progress-bar').default;

module.exports = class SetupLanguage extends Base {
  constructor(props) {
    super(props);
    this.state.languageCode = store.get('$setup').language;
  }

  onChangeLanguage = event => {
    event.preventDefault();
    progress.start();
    utils.setDefaultLanguage(event.target.value);
    location.reload();
  }

  onSubmit = event => {
    event.preventDefault();
    const $setup = store.get('$setup');
    $setup.language = window.currentLanguageCode;
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
                  />
                  <div className="form-group">
                    <div className="select-wrapper border rounded-pill overflow-hidden px-2">
                      <select name="language" value={window.currentLanguageCode} className="form-control border-0" onChange={this.onChangeLanguage}>
                        {
                          i18n.options.langCodesTitle.map(locale => (
                            <option key={locale.code} value={locale.code}>
                              {locale.title}
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
