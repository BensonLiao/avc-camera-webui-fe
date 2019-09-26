const classNames = require('classnames');
const React = require('react');
const PropTypes = require('prop-types');

module.exports = class DropdownField extends React.Component {
  static get propTypes() {
    return {
      className: PropTypes.any,
      buttonClassName: PropTypes.any,
      menuClassName: PropTypes.any,

      items: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.any.isRequired,
        label: PropTypes.string.isRequired
      }).isRequired).isRequired,
      field: PropTypes.shape({
        name: PropTypes.string.isRequired,
        value: PropTypes.string
      }).isRequired,
      form: PropTypes.shape({
        setFieldValue: PropTypes.func.isRequired
      }).isRequired
    };
  }

  static get defaultProps() {
    return {
      className: null,
      buttonClassName: null,
      menuClassName: null
    };
  }

  state = {};

  findItemByValue = value => {
    /*
    @param value {Any}
    @returns {Object|undefined}
     */
    return this.props.items.find(x => x.value === value) || this.props.items[0];
  };

  generateClickItemHandler = value => {
    /*
    @param value {Any}
    @returns {Function} (event) =>
     */
    return event => {
      event.preventDefault();
      this.props.form.setFieldValue(this.props.field.name, value);
    };
  };

  render() {
    const dropdownClass = classNames('dropdown', this.props.className);
    const buttonClass = classNames('btn dropdown-toggle', this.props.buttonClassName);
    const menuClass = classNames('dropdown-menu', this.props.menuClassName);

    return (
      <div className={dropdownClass}>
        <button className={buttonClass} type="button" data-toggle="dropdown">
          {(this.findItemByValue(this.props.field.value) || {label: ''}).label}
        </button>
        <div className={menuClass}>
          {
            this.props.items.map(item => (
              <a key={item.value} className="dropdown-item" href={`#${item.value}`}
                onClick={this.generateClickItemHandler(item.value)}
              >
                {item.label}
              </a>
            ))
          }
        </div>
      </div>
    );
  }
};
