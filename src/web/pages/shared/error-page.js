const React = require('react');
const PropTypes = require('prop-types');
const imageCode404 = require('../../../resource/icon-error-404.svg');
const imageCode500 = require('../../../resource/icon-error-500.svg');
const bgCode404 = require('../../../resource/bg-error-404-clip.png');
const bgCode500 = require('../../../resource/bg-error-500-clip.png');
const i18n = require('../../../i18n').default;

module.exports = class ErrorPage extends React.Component {
  static get propTypes() {
    return {error: PropTypes.any};
  }

  static get defaultProps() {
    return {error: 'Error'};
  }

  state = {};

  constructor(props) {
    super(props);
    document.title = `${i18n.t('Error')} - ${window.cameraName} Web-Manager`;
    this.state.status = props.error.status || 500;
    this.state.message = props.error.message ? props.error.message : `${props.error}`;
  }

  render() {
    const messageTitle = this.state.status === 404 ? i18n.t('Not Found') : i18n.t('Internal Server Error');

    return (
      <div className="error-page">
        <img className="mw-100" src={this.state.status === 404 ? bgCode404 : bgCode500}/>
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-12 text-center mt-5">
              {!window.isNoBrand && (
                <div className="col-center motion-blur">
                  <img src={this.state.status === 404 ? imageCode404 : imageCode500} className="blur-me"/>
                  <img src={this.state.status === 404 ? imageCode404 : imageCode500} className="blur-me two"/>
                  <img src={this.state.status === 404 ? imageCode404 : imageCode500} className="blur-me three"/>
                  <img src={this.state.status === 404 ? imageCode404 : imageCode500} className="blur-me four"/>
                  <img src={this.state.status === 404 ? imageCode404 : imageCode500} className="blur-me five"/>
                </div>
              )}
              <div className="message-container mt-5">
                <h2 className="message-status mb-0">{this.state.status}</h2>
                <h3 className="message-title">{messageTitle}</h3>
                <a className="btn btn-primary text-light rounded-pill mt-5" href="/">
                  {i18n.t('Back to Home')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
