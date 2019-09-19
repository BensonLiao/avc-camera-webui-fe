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
      mode: PropTypes.oneOf(['point', 'range']),
      min: PropTypes.number.isRequired,
      max: PropTypes.number.isRequired,
      step: PropTypes.number.isRequired
    };
  }

  static get defaultProps() {
    return {mode: 'point'};
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
      value: this.props.mode === 'point' ? this.props.field.value : JSON.stringify(this.props.field.value),
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
    return (
      <div className="left-selection">
        <input ref={this.ref} type="text"/>
      </div>
    );
  }
};
