import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import i18n from '../../../i18n';

const LicenseStatus = ({licenseName, isEnabled, licenseEnableImg, licenseDisableImg, isHide}) => {
  return (
    <div className={classNames(
      'border text-center bg-white',
      {'active shadow border-success': isEnabled},
      {'d-none': isHide})}
    >
      <div className="img-wrapper">
        <img src={isEnabled ? licenseEnableImg : licenseDisableImg}/>
      </div>
      <h4 className={classNames(
        'text-size-20 mt-3',
        isEnabled ? 'text-primary' : 'text-muted')}
      >
        {licenseName}
      </h4>
      <div className="bottom">
        <hr/>
        <span className={classNames(
          'border rounded-pill p-1 pr-2',
          isEnabled ? 'border-success text-success' : 'border-danger text-danger')}
        >
          <i className={classNames(
            'fas mr-1',
            isEnabled ? 'fa-check-circle' : 'fa-minus-circle')}
          />
          {isEnabled ? i18n.t('Activated') : i18n.t('Activation Required')}
        </span>
      </div>
    </div>
  );
};

LicenseStatus.propTypes = {
  licenseName: PropTypes.string.isRequired,
  isEnabled: PropTypes.bool.isRequired,
  licenseEnableImg: PropTypes.string.isRequired,
  licenseDisableImg: PropTypes.string.isRequired,
  // Option to isHide license component for specific camera models
  isHide: PropTypes.bool
};

LicenseStatus.defaultProps = {isHide: false};

export default LicenseStatus;
