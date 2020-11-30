import {getRouter} from '@benson.liao/capybara-router';
import progress from 'nprogress';
import React from 'react';
import i18n from '../../../i18n';
import logo from '../../../resource/logo-avc-secondary.svg';
import ProgressBar from './progress-bar';
import setupStep01 from '../../../resource/setup-step-01.png';
import store from '../../../core/store';
import {useContextState} from '../../stateProvider';
import utils from '../../../core/utils';
import withGlobalStatus from '../../withGlobalStatus';

const SetupLanguage = () => {
  const {isApiProcessing} = useContextState();

  const onChangeLanguage = event => {
    event.preventDefault();
    progress.start();
    utils.setDefaultLanguage(event.target.value);
    location.reload();
  };

  const onSubmit = event => {
    event.preventDefault();
    const $setup = store.get('$setup');
    $setup.language = window.currentLanguageCode;
    store.set('$setup', $setup);
    getRouter().go('/setup/account');
  };

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
                    <select name="language" value={window.currentLanguageCode} className="form-control border-0" onChange={onChangeLanguage}>
                      {
                        Object.keys(i18n.options.langCodesTitle).map(code => (
                          <option key={code} value={code}>
                            {i18n.options.langCodesTitle[code].title}
                          </option>
                        ))
                      }
                    </select>
                  </div>
                </div>

                <button disabled={isApiProcessing} type="submit" className="btn btn-primary btn-block rounded-pill" onClick={onSubmit}>
                  {i18n.t('Next')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withGlobalStatus(SetupLanguage);
