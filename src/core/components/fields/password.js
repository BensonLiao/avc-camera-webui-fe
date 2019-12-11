const classNames = require('classnames');
const PropTypes = require('prop-types');
const React = require('react');
const {Field} = require('formik');

module.exports = class Password extends React.PureComponent {
  static get propTypes() {
    return {
      inputProps: PropTypes.object,
      field: PropTypes.shape({
        name: PropTypes.string.isRequired
      }).isRequired
    };
  }

  static get defaultProps() {
    return {
      inputProps: {}
    };
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
        <Field {...inputProps} {...field} type={isShowPassword ? 'text' : 'password'}/>
        <a href="#" className="form-control-feedback text-muted"
          onClick={this.onTogglePassword}
        >
          <i className={classNames('fas', isShowPassword ? 'fa-eye' : 'fa-eye-slash')}/>
        </a>
      </>
    );
  }
};
