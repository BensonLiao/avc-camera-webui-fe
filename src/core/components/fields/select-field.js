const classNames = require('classnames');
const React = require('react');
const PropTypes = require('prop-types');
const {Field} = require('formik');

module.exports = class SelectField extends React.PureComponent {
  static get propTypes() {
    return {
      hide: PropTypes.bool,
      labelName: PropTypes.string.isRequired,
      wrapperClassName: PropTypes.string,
      readOnly: PropTypes.bool,
      name: PropTypes.string.isRequired,
      className: PropTypes.string,
      children: PropTypes.node.isRequired
    };
  }

  static get defaultProps() {
    return {
      hide: false,
      readOnly: false,
      wrapperClassName: '',
      className: ''
    };
  }

  render() {
    const {hide, labelName, wrapperClassName, readOnly, name, className, children} = this.props;
    return (
      <div className={classNames('form-group', (hide && 'd-none'))}>
        <label>{labelName}</label>
        <div className={classNames('select-wrapper border rounded-pill overflow-hidden', readOnly && 'select-readonly', wrapperClassName)}>
          <Field
            readOnly={readOnly}
            name={name}
            component="select"
            className={classNames('form-control border-0', className)}
          >
            {children}
          </Field>
        </div>
      </div>
    );
  }
};
