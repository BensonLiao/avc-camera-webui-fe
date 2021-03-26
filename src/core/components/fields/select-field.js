const classNames = require('classnames');
const React = require('react');
const PropTypes = require('prop-types');
const {Field} = require('formik');

module.exports = class SelectField extends React.PureComponent {
  static get propTypes() {
    return {
      hide: PropTypes.bool,
      labelName: PropTypes.string.isRequired,
      labelClassName: PropTypes.string,
      wrapperClassName: PropTypes.string,
      formClassName: PropTypes.string,
      readOnly: PropTypes.bool,
      name: PropTypes.string.isRequired,
      className: PropTypes.string,
      children: PropTypes.node.isRequired,
      row: PropTypes.bool,
      noMb: PropTypes.bool
    };
  }

  static get defaultProps() {
    return {
      hide: false,
      formClassName: '',
      labelClassName: '',
      readOnly: false,
      wrapperClassName: '',
      className: '',
      row: false,
      noMb: false
    };
  }

  render() {
    const {
      hide, labelName, labelClassName, formClassName, wrapperClassName, readOnly, name, className, children, row, noMb, ...extraProps
    } = this.props;

    return (
      <div className={classNames('form-group', (hide && 'd-none'), (noMb && 'mb-0'), (row && 'row'), formClassName)}>
        <label className={labelClassName}>{labelName}</label>
        <div className={classNames('select-wrapper border rounded-pill overflow-hidden', readOnly && 'select-readonly', wrapperClassName)}>
          <Field
            {...extraProps}
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
