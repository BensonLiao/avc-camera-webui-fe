const React = require('react');
const {getRouter} = require('capybara-router');
const progress = require('nprogress');
const logo = require('webserver-prototype/src/resource/logo-01.svg');
const decoration = require('webserver-prototype/src/resource/decoration-01.svg');
const setupStep01 = require('webserver-prototype/src/resource/setup-step-01.png');
const setupStep01x2 = require('webserver-prototype/src/resource/setup-step-01@2x.png');
const _ = require('../../../languages');
const Base = require('../shared/base');
const store = require('../../../core/store');
const utils = require('../../../core/utils');

module.exports = class SetupLanguage extends Base {
  constructor(props) {
    super(props);
    this.state.languageCode = store.get('$setup').language;

    this.generateChangeLanguageHandler = this.generateChangeLanguageHandler.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  generateChangeLanguageHandler(languageCode) {
    return event => {
      event.preventDefault();
      progress.start();
      utils.setCurrentLanguage(languageCode);
      location.reload();
    };
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
                    <div className="dropdown">
                      <button
                        className="btn btn-block rounded-pill dropdown-toggle d-flex justify-content-between align-items-center"
                        type="button" data-toggle="dropdown"
                      >
                        <span><i className="fas fa-globe fa-fw"/> {window.config.languages[this.state.languageCode].title}</span>
                      </button>
                      <div className="dropdown-menu">
                        {
                          Object.keys(window.config.languages).map(languageCode => (
                            <a key={languageCode} className="dropdown-item"
                              href={`#${languageCode}`}
                              onClick={this.generateChangeLanguageHandler(languageCode)}
                            >
                              {window.config.languages[languageCode].title}
                            </a>
                          ))
                        }
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary btn-block rounded-pill" onClick={this.onSubmit}>
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
