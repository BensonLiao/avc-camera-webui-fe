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
const classNames = require('classnames');
const React = require('react');
const defaultVideoBackground = require('../../resource/video-bg.jpg');
const store = require('../../core/store');
const utils = require('../../core/utils');

module.exports = class LiveView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.streamPlayerRef = React.createRef();
    this.fetchSnapshotTimeoutId = null;
    store.set(`${this.constructor.name}.isPlayStream`, true);
    // To prevent memory leak on unmount
    this.signal = axios.CancelToken.source();
  }

  state = {
    isPlayStream: true,
    streamImageUrl: null
  };

  componentDidMount() {
    if (this.state.isPlayStream) {
      this.fetchSnapshot();
    }
  }

  componentWillUnmount() {
    if (this.state.streamImageUrl) {
      window.URL.revokeObjectURL(this.state.streamImageUrl);
    }

    store.set(`${this.constructor.name}.isPlayStream`, false);
    clearTimeout(this.fetchSnapshotTimeoutId);
    this.signal.cancel('Cancel playback');
  }

  fetchSnapshot = () => {
    axios.get('/api/snapshot', {
      timeout: 1500,
      responseType: 'blob',
      cancelToken: this.signal.token
    })
      .then(response => {
        if (this.state.streamImageUrl) {
          window.URL.revokeObjectURL(this.state.streamImageUrl);
        }

        if (this.state.isPlayStream) {
          const imageUrl = window.URL.createObjectURL(response.data);
          this.setState({streamImageUrl: imageUrl}, this.fetchSnapshot);
        }
      })
      .catch(error => {
        if (error && error.response && error.response.status === 401) {
          location.href = '/login';
          return;
        }

        if (store.get(`${this.constructor.name}.isPlayStream`) &&
          (this.state.isPlayStream || error.code === 'ECONNABORTED')) {
          // Wait 500ms to retry.
          this.fetchSnapshotTimeoutId = setTimeout(this.fetchSnapshot, 500);
        }
      });
  };

  render() {
    const {streamImageUrl, isPlayStream} = this.state;
    return (
      <div className="video-wrapper mb-4">
        <div ref={this.streamPlayerRef}>
          <img
            className="img-fluid"
            draggable={false}
            src={streamImageUrl || defaultVideoBackground}
            onClick={e => utils.onTogglePlayStream(e, this)}
          />
          <div
            className={classNames('cover d-flex justify-content-center align-items-center', {pause: isPlayStream})}
            onClick={e => utils.onTogglePlayStream(e, this)}
          >
            <button className="btn-play" type="button">
              <i className="fas fa-play fa-fw"/>
            </button>
          </div>
          {
            isPlayStream && !streamImageUrl && (
              <div
                className="cover d-flex justify-content-center align-items-center text-muted"
                onClick={e => utils.onTogglePlayStream(e, this)}
              >
                <div className="spinner-border">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            )
          }
          <div className="controls d-flex justify-content-end align-items-center">
            <div>
              <button className="btn-action" type="button" onClick={e => utils.onClickDownloadImage(e)}>
                <i className="fas fa-camera"/>
              </button>
              <button className="btn-action" type="button" onClick={e => utils.toggleFullscreen(e, this.streamPlayerRef)}>
                <i className="fas fa-expand-arrows-alt"/>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
