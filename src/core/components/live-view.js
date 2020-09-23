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
const dayjs = require('dayjs');
const download = require('downloadjs');
const progress = require('nprogress');
const React = require('react');
const api = require('../../core/apis/web-api');
const defaultVideoBackground = require('../../resource/video-bg.jpg');
const notify = require('../../core/notify');

module.exports = class LiveView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.streamPlayerRef = React.createRef();
    this.fetchSnapshotTimeoutId = null;
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

        if (this.state.isPlayStream || error.code === 'ECONNABORTED') {
          // Wait 500ms to retry.
          this.fetchSnapshotTimeoutId = setTimeout(this.fetchSnapshot, 500);
        }
      });
  };

  onTogglePlayStream = event => {
    event.preventDefault();

    this.setState(prevState => {
      if (prevState.isPlayStream) {
        // Stop play stream
        if (prevState.streamImageUrl) {
          window.URL.revokeObjectURL(prevState.streamImageUrl);
        }

        return {
          isPlayStream: false,
          streamImageUrl: null
        };
      }

      // Get the stream data
      this.fetchSnapshot();
      // Start play stream
      return {isPlayStream: true};
    });
  };

  onClickDownloadImage = event => {
    event.preventDefault();
    api.system.getSystemDateTime()
      .then(({data}) => {
        const fileName = dayjs(data.deviceTime).tz(data.ntpTimeZone).format('YYYYMMDD-HHmmss');
        axios.get('/api/snapshot', {
          timeout: 1500,
          responseType: 'blob'
        })
          .then(response => {
            download(response.data, `${fileName}.jpg`);
          })
          .catch(error => {
            progress.done();
            notify.showErrorNotification({
              title: `Error ${error.response.status}` || null,
              message: error.response.status === 400 ? error.response.data.message || null : null
            });
          });
      });
  };

  onToggleFullscreen = event => {
    event.preventDefault();

    let isInFullScreen = (document.fullscreenElement && document.fullscreenElement !== null) ||
        (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
        (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
        (document.msFullscreenElement && document.msFullscreenElement !== null);

    if (!isInFullScreen) {
      if (this.streamPlayerRef.current.requestFullscreen) {
        this.streamPlayerRef.current.requestFullscreen();
      } else if (this.streamPlayerRef.current.mozRequestFullScreen) {
        this.streamPlayerRef.current.mozRequestFullScreen();
      } else if (this.streamPlayerRef.current.webkitRequestFullScreen) {
        this.streamPlayerRef.current.webkitRequestFullScreen();
      } else if (this.streamPlayerRef.current.msRequestFullscreen) {
        this.streamPlayerRef.current.msRequestFullscreen();
      }
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
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
            onClick={this.onTogglePlayStream}
          />
          <div
            className={classNames('cover d-flex justify-content-center align-items-center', {pause: isPlayStream})}
            onClick={this.onTogglePlayStream}
          >
            <button className="btn-play" type="button">
              <i className="fas fa-play fa-fw"/>
            </button>
          </div>
          {
            isPlayStream && !streamImageUrl && (
              <div
                className="cover d-flex justify-content-center align-items-center text-muted"
                onClick={this.onTogglePlayStream}
              >
                <div className="spinner-border">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            )
          }
          <div className="controls d-flex justify-content-end align-items-center">
            <div>
              <button className="btn-action" type="button" onClick={this.onClickDownloadImage}>
                <i className="fas fa-camera"/>
              </button>
              <button className="btn-action" type="button" onClick={this.onToggleFullscreen}>
                <i className="fas fa-expand-arrows-alt"/>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
