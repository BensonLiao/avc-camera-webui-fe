const classNames = require('classnames');
const PropTypes = require('prop-types');
const React = require('react');
const {default: i18n} = require('../../../web/i18n');
const CustomTooltip = require('../tooltip');

module.exports = class Password extends React.PureComponent {
  static get propTypes() {
    return {
      inputProps: PropTypes.object,
      field: PropTypes.shape({name: PropTypes.string.isRequired}).isRequired
    };
  }

  static get defaultProps() {
    return {inputProps: {}};
  }

  state = {isShowPassword: false};

  onTogglePassword = event => {
    event.preventDefault();
    this.setState(prevState => ({isShowPassword: !prevState.isShowPassword}));
  };

  render() {
    const {inputProps, field} = this.props;
    const {isShowPassword} = this.state;

    return (
      <>
        <input {...inputProps} {...field} type={isShowPassword ? 'text' : 'password'}/>
        <a
          href="#"
          className="form-control-feedback text-muted"
          tabIndex={-1}
          onClick={this.onTogglePassword}
        >
          <CustomTooltip title={isShowPassword ? i18n.t('Hide Password') : i18n.t('Show Password')}>
            <i className={classNames('fas', isShowPassword ? 'fa-eye' : 'fa-eye-slash')}/>
          </CustomTooltip>
        </a>
      </>
    );
  }
};
