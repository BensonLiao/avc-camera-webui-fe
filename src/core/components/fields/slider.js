/* eslint-disable camelcase */
const React = require('react');
const PropTypes = require('prop-types');
const Slider = require('bootstrap-slider');

module.exports = class SliderField extends React.PureComponent {
  static get propTypes() {
    return {
      field: PropTypes.shape({
        name: PropTypes.string.isRequired,
        value: PropTypes.any
      }).isRequired,
      form: PropTypes.shape({
        setFieldValue: PropTypes.func.isRequired
      }).isRequired,
      min: PropTypes.number.isRequired,
      max: PropTypes.number.isRequired,
      step: PropTypes.number.isRequired,
      disabled: PropTypes.bool,
      updateFieldOnStop: PropTypes.bool
    };
  }

  static get defaultProps() {
    return {
      disabled: false,
      updateFieldOnStop: false
    };
  }

  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.slider = null;
  }

  componentDidMount() {
    this.slider = new Slider(this.ref.current, {
      min: this.props.min,
      max: this.props.max,
      value: this.props.field.value,
      step: `${this.props.step}`,
      focus: true,
      natural_arrow_keys: true
    });
    if (this.props.updateFieldOnStop) {
      this.slider.on('slideStop', value => {
        this.props.form.setFieldValue(this.props.field.name, value);
      });
    } else {
      this.slider.on('change', ({newValue}) => {
        this.props.form.setFieldValue(this.props.field.name, newValue);
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
