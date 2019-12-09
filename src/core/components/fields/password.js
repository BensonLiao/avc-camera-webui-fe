const classNames = require('classnames');
const PropTypes = require('prop-types');
const React = require('react');

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

  state = {
    isShowPassword: false
  };

  onShowPassword = event => {
    event.preventDefault();
    this.setState({isShowPassword: true});
  };

  onHidePassword = event => {
    event.preventDefault();
    this.setState({isShowPassword: false});
  };

  onClickPassword = event => {
    event.preventDefault();
  };

  render() {
    const {inputProps, field} = this.props;
    const {isShowPassword} = this.state;

    return (
      <>
        <input {...inputProps} name={field.name} type={isShowPassword ? 'text' : 'password'}/>
        <a href="#" className="form-control-feedback text-muted"
          onClick={this.onClickPassword}
          onMouseDown={this.onShowPassword}
          onMouseUp={this.onHidePassword}
          onMouseOut={this.onHidePassword}
        >
          <i className={classNames('fas', isShowPassword ? 'fa-eye' : 'fa-eye-slash')}/>
        </a>
      </>
    );
  }
};
