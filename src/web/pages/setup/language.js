const React = require('react');
const {getRouter} = require('capybara-router');
const progress = require('nprogress');
const logo = require('../../../resource/logo-01.svg');
const decoration = require('../../../resource/decoration-01.svg');
const setupStep01 = require('../../../resource/setup-step-01.png');
const setupStep01x2 = require('../../../resource/setup-step-01@2x.png');
const _ = require('../../../languages');
const Base = require('../shared/base');
const store = require('../../../core/store');
const utils = require('../../../core/utils');

module.exports = class SetupLanguage extends Base {
  constructor(props) {
    super(props);
    this.state.languageCode = store.get('$setup').language;

    this.onChangeLanguage = this.onChangeLanguage.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChangeLanguage(event) {
    event.preventDefault();
    progress.start();
    utils.setDefaultLanguage(event.target.value);
    location.reload();
  }

  onSubmit(event) {
    event.preventDefault();
    getRouter().go('/setup/account');
  }

  render() {
    return (
      <div className="page-setup-language">
        <img src={logo} className="logo" alt="AndroVideo"/>
        <img src={decoration} className="decoration"/>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-card">
              <form className="card shadow mb-5">
                <div className="card-body">
                  <div className="steps">
                    <div className="d-flex justify-content-between">
                      <p className="text-primary">{_('Language')}</p>
                      <p>{_('SETUP-Account')}</p>
                      <p>{_('HTTPS')}</p>
                    </div>
                    <img src={setupStep01} srcSet={`${setupStep01x2} 2x`}/>
                  </div>
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
                    {_('Next')}
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
