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
      step: PropTypes.number.isRequired
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
      step: this.props.step
    });
    this.slider.on('change', ({newValue}) => {
      this.props.form.setFieldValue(this.props.field.name, newValue);
    });
  }

  componentWillUnmount() {
    this.slider.destroy();
  }

  render() {
    return <input ref={this.ref} type="text"/>;
  }
};
