import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import i18n from '../../../i18n';

const LicenseStatus = ({licenseName, licenseKeyStatus, licenseEnableImg, licenseDisableImg, hide}) => {
  return (
    <div className={classNames(
      'border text-center bg-white',
      {'active shadow border-success': licenseKeyStatus},
      {'d-none': hide})}
    >
      <div className="img-wrapper">
        <img src={licenseKeyStatus ? licenseEnableImg : licenseDisableImg}/>
      </div>
      <h4 className={classNames(
        'text-size-20 mt-3',
        licenseKeyStatus ? 'text-primary' : 'text-muted')}
      >
        {licenseName}
      </h4>
      <div className="bottom">
        <hr/>
        <span className={classNames(
          'border rounded-pill p-1 pr-2',
          licenseKeyStatus ? 'border-success text-success' : 'border-danger text-danger')}
        >
          <i className={classNames(
            'fas mr-1',
            licenseKeyStatus ? 'fa-check-circle' : 'fa-minus-circle')}
          />
          {licenseKeyStatus ? i18n.t('Activated') : i18n.t('Activation Required')}
        </span>
      </div>
    </div>
  );
};

LicenseStatus.propTypes = {
  licenseName: PropTypes.string.isRequired,
  licenseKeyStatus: PropTypes.bool.isRequired,
  licenseEnableImg: PropTypes.string.isRequired,
  licenseDisableImg: PropTypes.string.isRequired,
  // Option to hide license component for specific camera models
  hide: PropTypes.bool
};

LicenseStatus.defaultProps = {hide: false};

export default LicenseStatus;
