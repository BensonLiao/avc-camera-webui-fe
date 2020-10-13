/* eslint-disable camelcase */
const React = require('react');
const PropTypes = require('prop-types');
const Slider = require('bootstrap-slider');
const {getPrecision} = require('../../utils');

module.exports = class SliderField extends React.PureComponent {
  static get propTypes() {
    return {
      field: PropTypes.shape({
        name: PropTypes.string.isRequired,
        value: PropTypes.any
      }).isRequired,
      form: PropTypes.shape({setFieldValue: PropTypes.func.isRequired}).isRequired,
      min: PropTypes.number.isRequired,
      max: PropTypes.number.isRequired,
      step: PropTypes.number.isRequired,
      disabled: PropTypes.bool,
      updateFieldOnStop: PropTypes.bool,
      enableArrowKey: PropTypes.bool,
      onChangeInput: PropTypes.func
    };
  }

  static get defaultProps() {
    return {
      disabled: false,
      updateFieldOnStop: false,
      enableArrowKey: false,
      onChangeInput: null
    };
  }

  constructor() {
    super();
    this.ref = React.createRef();
    this.slider = null;
  }

  componentDidMount() {
    const precisionDigit = getPrecision(this.props.step);
    this.slider = new Slider(this.ref.current, {
      min: this.props.min,
      max: this.props.max,
      value: this.props.field.value,
      step: this.props.step,
      focus: this.props.enableArrowKey,
      natural_arrow_keys: this.props.enableArrowKey
    });
    if (this.props.updateFieldOnStop) {
      this.slider.on('slideStop', value => {
        this.props.form.setFieldValue(
          this.props.field.name,
          typeof value === 'number' ? Number(value.toFixed(precisionDigit)) : value
        );
      });
    } else {
      this.slider.on('change', ({newValue}) => {
        this.props.form.setFieldValue(
          this.props.field.name, Number(newValue.toFixed(precisionDigit))
        );
      });
    }

    if (this.props.disabled) {
      this.slider.disable();
    }
  }

  componentWillUnmount() {
    this.slider.destroy();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.field.value !== this.props.field.value) {
      this.slider.setValue(this.props.field.value);
      if (this.props.onChangeInput) {
        this.props.onChangeInput();
      }
    }

    if (prevProps.disabled !== this.props.disabled) {
      if (this.props.disabled) {
        this.slider.disable();
      } else {
        this.slider.enable();
      }
    }
  }

  render() {
    return (
      <div className="left-selection">
        <input ref={this.ref} type="text"/>
      </div>
    );
  }
};
