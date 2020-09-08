const classNames = require('classnames');
const PropTypes = require('prop-types');
const React = require('react');
const _ = require('../../../languages');

module.exports = class LicenseStatus extends React.PureComponent {
  static get propTypes() {
    return {
      licenseName: PropTypes.string.isRequired,
      licenseKeyStatus: PropTypes.bool.isRequired,
      licenseEnableImg: PropTypes.string.isRequired,
      licenseDisableImg: PropTypes.string.isRequired,
      // Option to hide license component for specific camera models
      hide: PropTypes.bool
    };
  }

  static get defaultProps() {
    return {hide: false};
  }

  render() {
    const {licenseName, licenseKeyStatus, licenseEnableImg, licenseDisableImg, hide} = this.props;
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
              'fas',
              licenseKeyStatus ? 'fa-check-circle' : 'fa-minus-circle')}
            />
            {licenseKeyStatus ? _('Activated') : _('Inactive')}
          </span>
        </div>
      </div>
    );
  }
};
