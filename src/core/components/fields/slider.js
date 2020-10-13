/* eslint-disable camelcase */
const React = require('react');
const PropTypes = require('prop-types');
const Slider = require('bootstrap-slider');
const CustomTooltip = require('../tooltip');
const {getPrecision, isArray} = require('../../utils');

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
      onChangeInput: PropTypes.func,
      isRemoveStepper: PropTypes.bool
    };
  }

  static get defaultProps() {
    return {
      disabled: false,
      updateFieldOnStop: false,
      enableArrowKey: false,
      onChangeInput: null,
      isRemoveStepper: false
    };
  }

  constructor() {
    super();
    this.ref = React.createRef();
    this.slider = null;
  }

  varyStep = step => {
    const {form, field: {name, value}, min, max} = this.props;
    let newValue = step + value;
    if (newValue < min) {
      newValue = min;
    }

    if (newValue > max) {
      newValue = max;
    }

    form.setFieldValue(name, newValue);
  }

  componentDidMount() {
    this.slider = new Slider(this.ref.current, {
      min: this.props.min,
      max: this.props.max,
      value: this.props.field.value,
      step: this.props.step,
      focus: this.props.enableArrowKey,
      natural_arrow_keys: this.props.enableArrowKey
    });
    const precisionDigit = getPrecision(this.props.step);
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
    const {isRemoveStepper, disabled, step, field: {value}} = this.props;
    return isRemoveStepper || isArray(value) ? (
      <div className="left-selection">
        <input ref={this.ref} type="text"/>
      </div>
    ) : (
      <div className="mt-2 d-flex align-items-center justify-content-between focal-length">
        <div>
          <CustomTooltip title={`${-step * 5}`}>
            <button
              disabled={disabled}
              className="btn text-secondary-700"
              type="button"
              onClick={() => this.varyStep(-step * 5)}
            >
              <i type="button" className="fa fa-angle-double-left text-size-16"/>
            </button>
          </CustomTooltip>
          <CustomTooltip title={`${-step}`}>
            <button
              disabled={disabled}
              className="btn text-secondary-700"
              type="button"
              onClick={() => this.varyStep(-step)}
            >
              <i className="fas fa-angle-left text-size-16"/>
            </button>
          </CustomTooltip>
        </div>
        <div className="flex-grow-1">
          <div className="left-selection">
            <input ref={this.ref} type="text"/>
          </div>
        </div>
        <div>
          <CustomTooltip title={`+${step}`}>
            <button
              disabled={disabled}
              className="btn text-secondary-700"
              type="button"
              onClick={() => this.varyStep(step)}
            >
              <i className="fas fa-angle-right text-size-16"/>
            </button>
          </CustomTooltip>
          <CustomTooltip title={`+${step * 5}`}>
            <button
              disabled={disabled}
              className="btn text-secondary-700"
              type="button"
              onClick={() => this.varyStep(step * 5)}
            >
              <i className="fa fa-angle-double-right text-size-16"/>
            </button>
          </CustomTooltip>
        </div>
      </div>
    );
  }
};
