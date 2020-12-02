import {Link} from '@benson.liao/capybara-router';
import React from 'react';
import i18n from '../../../i18n';
import logo from '../../../resource/logo-avc-secondary.svg';
import Once from '../../../core/components/one-time-render';
import smileWinkSolid from '../../../resource/smile-wink-solid.svg';

const Welcome = () => {
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
                    <h3 className="text-primary mb-3" style={{fontSize: '39px'}}>{i18n.t('setup.welcome.welcome')}</h3>
                    <p>
                      {i18n.t('setup.welcome.welcomeText1')}
                      <br/>
                      {i18n.t('setup.welcome.welcomeText2')}
                    </p>
                  </div>
                  <Link to="/setup/language" className="btn btn-primary btn-block rounded-pill">
                    {i18n.t('setup.welcome.continue')}
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Once>
    </div>
  );
};

export default Welcome;
