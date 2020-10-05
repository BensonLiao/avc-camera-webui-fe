const React = require('react');
const {Link} = require('capybara-router');
const logo = require('../../../resource/logo-avc-secondary.svg');
const smileWinkSolid = require('../../../resource/smile-wink-solid.svg');
const {default: i18n} = require('../../i18n');
const Base = require('../shared/base');
const Once = require('../../../core/components/one-time-render');

module.exports = class Welcome extends Base {
  render() {
    return (
      <div className="page-welcome bg-secondary">
        <div className="navbar primary">
          { !window.isNoBrand &&
          <img src={logo}/>}
        </div>
        <Once>
          <div className="container-fluid">
            <div className="row justify-content-center">
              <div className="col-card">
                <form className="card shadow mb-5">
                  <div className="card-body">
                    <h5 className="card-title"/>
                    <div className="text-center mb-5">
                      <img src={smileWinkSolid} className="mb-4" width="120" height="120"/>
                      <h3 className="text-primary mb-3" style={{fontSize: '39px'}}>{i18n.t('Welcome')}</h3>
                      <p>
                        {i18n.t('For a better experience,')}
                        <br/>
                        {i18n.t('please press continue to complete the simple three-step installation setup!')}
                      </p>
                    </div>

                    <Link to="/setup/language" className="btn btn-primary btn-block rounded-pill">
                      {i18n.t('Continue')}
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Once>
      </div>
    );
  }
};
