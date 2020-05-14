const Base = require('./shared/base');
const React = require('react');
const ReactDOM = require('react-dom');
const axios = require('axios');
axios.interceptors.response.use(
  config => config,
  error => {
    if (error.response.status === 408 || error.code === 'ECONNABORTED') {
      console.log(`A timeout happend on url ${error.config.url}`);
    }

    return Promise.reject(error);
  }
);

module.exports = class H264 extends Base {
  constructor(props) {
    super(props);
    this.state.streamImageUrl = null;
  }

  componentDidMount() {
    this.fetchFrames();
  }

  fetchFrames = () => {
    axios.get('/api/h264-frame', {responseType: 'blob'})
      .then(response => {
        console.log(response);
        if (this.state.streamImageUrl) {
          window.URL.revokeObjectURL(this.state.streamImageUrl);
        }

        const imageUrl = window.URL.createObjectURL(response.data);
        this.setState({streamImageUrl: imageUrl}, this.fetchFrames);
      })
      .catch(error => {
        if (error && error.response && error.response.status === 401) {
          location.href = '/login';
        }
      });
  };

  render() {
    const mount = document.body;
    return ReactDOM.createPortal(
      <>
        <div style={{textAlign: 'center'}}>
          <video
            autoPlay className="img-fluid"
            style={{height: '100vh'}}
            src={this.state.streamImageUrl}/>
        </div>
      </>
      ,
      mount
    );
  }
};
