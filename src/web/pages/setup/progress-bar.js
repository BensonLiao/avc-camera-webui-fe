import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'capybara-router';
import i18n from '../../i18n';

const ProgressBar = ({step, hasPreviousPage, progressBarImage, progressBarImagex2}) => {
  return (
    <div className="steps d-flex">
      <div className="d-flex flex-grow-1 justify-content-between">
        <p className="text-primary">{i18n.t('Language')}</p>
        <p className={step > 1 && 'text-primary'}>{i18n.t('Setup Account')}</p>
        <p className={step > 2 && 'text-primary'}>{i18n.t('HTTPS')}</p>
      </div>
      <img src={progressBarImage} srcSet={`${progressBarImagex2} 2x`}/>
      { hasPreviousPage && (
        <Link to="/setup/language" className="go-back">
          <i className="fas fa-chevron-left"/>
        </Link>
      )}
    </div>
  );
};

ProgressBar.propTypes = {
  hasPreviousPage: PropTypes.bool,
  step: PropTypes.number.isRequired,
  progressBarImage: PropTypes.string.isRequired,
  progressBarImagex2: PropTypes.string.isRequired
};

ProgressBar.defaultProps = {hasPreviousPage: true};

export default ProgressBar;
