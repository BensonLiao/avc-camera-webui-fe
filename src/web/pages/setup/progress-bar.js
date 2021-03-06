import React from 'react';
import PropTypes from 'prop-types';
import {Link} from '@benson.liao/capybara-router';
import i18n from '../../../i18n';

const ProgressBar = ({step, hasPreviousPage, progressBarImage}) => {
  return (
    <div className="steps d-flex">
      <div className="d-flex flex-grow-1 justify-content-between">
        <p className="text-primary">{i18n.t('setup.progressBar.language')}</p>
        <p className={`${step > 1 ? 'text-primary' : ''}`}>{i18n.t('setup.progressBar.setupAccount')}</p>
      </div>
      <img src={progressBarImage}/>
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
  progressBarImage: PropTypes.string.isRequired
};

ProgressBar.defaultProps = {hasPreviousPage: true};

export default ProgressBar;
