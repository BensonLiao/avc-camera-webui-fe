const React = require('react');
const {Link} = require('capybara-router');
const logo = require('webserver-prototype/src/resource/logo-01.svg');
const decoration = require('webserver-prototype/src/resource/decoration-01.svg');
const smileWinkSolid = require('webserver-prototype/src/resource/smile-wink-solid.svg');
const _ = require('../../../languages');
const Base = require('../shared/base');
const Once = require('../../../core/components/one-time-render');

module.exports = class Welcome extends Base {
  render() {
    return (
      <div className="page-welcome">
        <img src={logo} className="logo" alt="AndroVideo"/>
        <img src={decoration} className="decoration"/>
        <Once>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-card">
                <form className="card shadow mb-5">
                  <div className="card-body">
                    <h5 className="card-title"/>
                    <div className="text-center mb-5">
                      <img src={smileWinkSolid} className="mb-4" width="120" height="120"/>
                      <h3 className="text-primary mb-3" style={{fontSize: '39px'}}>{_('Welcome')}</h3>
                      <p>
                        {_('For the good experience.')}
                        <br/>
                        {_('Please press Continue to complete the simple three-step installation setup!')}
                      </p>
                    </div>

                    <Link to="/setup/language" className="btn btn-primary btn-block rounded-pill">
                      {_('Continue')}
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
