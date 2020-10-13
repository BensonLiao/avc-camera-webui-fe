const Base = require('./shared/base');
const React = require('react');
const axios = require('axios');
const ReactDOM = require('react-dom');
const PropTypes = require('prop-types');
const api = require('../../core/apis/web-api');
const store = require('../../core/store');
const SessionExpireModal = require('../../core/components/session-expire-modal');

axios.interceptors.response.use(
  config => config,
  error => {
    if (error.response.status === 408 || error.code === 'ECONNABORTED') {
      console.log(`A timeout happend on url ${error.config.url}`);
    }

    return Promise.reject(error);
  }
);

module.exports = class Mjpeg extends Base {
  static get propTypes() {
    return {
      params: PropTypes.shape({
        res: PropTypes.oneOf(['half', 'full']),
        quality: PropTypes.string
      })
    };
  }

  constructor() {
    super();
    this.state.streamImageUrl = null;
    this.state.isShowAboutModal = false;
    store.set(`${this.constructor.name}.isPlayStream`, true);
  }

  componentDidMount() {
    const {params} = this.props;
    if (!Object.values(params).some(query => query === undefined)) {
      api.updateMjpeg(params);
    }

    this.fetchSnapshot();
  }

  componentWillUnmount() {
    store.set(`${this.constructor.name}.isPlayStream`, false);
  }

  fetchSnapshot = () => {
    if (store.get(`${this.constructor.name}.isPlayStream`)) {
      axios.get('/api/mjpeg-snapshot', {responseType: 'blob'})
        .then(response => {
          if (this.state.streamImageUrl) {
            window.URL.revokeObjectURL(this.state.streamImageUrl);
          }

          const imageUrl = window.URL.createObjectURL(response.data);
          this.setState({streamImageUrl: imageUrl}, this.fetchSnapshot);
        })
        .catch(error => {
          if (error && error.response && error.response.status === 401) {
            location.href = '/login';
          }
        });
    }
  };

  render() {
    const mount = document.body;
    return ReactDOM.createPortal(
      <>
        <div style={{textAlign: 'center'}}>
          <img
            className="img-fluid"
            style={{height: '100vh'}}
            src={this.state.streamImageUrl}
          />
        </div>
        <SessionExpireModal/>
      </>
      ,
      mount
    );
  }
};
