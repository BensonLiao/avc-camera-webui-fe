const PropTypes = require('prop-types');
const React = require('react');

module.exports = class ImagePreview extends React.PureComponent {
  static get propTypes() {
    return {
      file: PropTypes.object,
      url: PropTypes.string,
      render: PropTypes.func.isRequired
    };
  }

  static get defaultProps() {
    return {file: null, url: null};
  }

  state = {imagePreviewUrl: null};

  constructor(props) {
    super(props);
    this.useBlob = Boolean(window.URL);
  }

  readFile = () => {
    /*
    Read the file from the input.
     */
    if (!this.props.file) {
      this.setState({imagePreviewUrl: null});
      return;
    }

    if (this.useBlob) {
      if (this.state.imagePreviewUrl) {
        window.URL.revokeObjectURL(this.state.imagePreviewUrl);
      }

      this.setState({imagePreviewUrl: window.URL.createObjectURL(this.props.file)});
    } else {
      const fileReader = new FileReader();
      fileReader.onloadend = () => this.setState({imagePreviewUrl: fileReader.result});
      fileReader.readAsDataURL(this.props.file);
    }
  };

  componentDidMount() {
    this.readFile();
  }

  componentDidUpdate(prevProps) {
    if (this.props.file !== prevProps.file) {
      // The parent update props.file.
      this.readFile();
    }
  }

  componentWillUnmount() {
    if (this.useBlob && this.state.imagePreviewUrl) {
      window.URL.revokeObjectURL(this.state.imagePreviewUrl);
    }
  }

  render() {
    return this.props.render({
      imagePreviewUrl: this.state.imagePreviewUrl,
      url: this.props.url
    });
  }
};
