const classNames = require('classnames');
const React = require('react');
const PropTypes = require('prop-types');
const imageCode404 = require('../../../resource/error-404-code.svg');
const imageCode500 = require('../../../resource/error-500-code.svg');
const imageOops = require('../../../resource/error-oops.svg');
const imageError01 = require('../../../resource/error-icon-01.svg');
const imageError02 = require('../../../resource/error-icon-02.svg');
const imageError03 = require('../../../resource/error-icon-03.svg');
const imageError04 = require('../../../resource/error-icon-04.svg');
const imageError05 = require('../../../resource/error-icon-05.svg');
const _ = require('../../../languages');

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
    document.title = `${_('Error')} - ${window.cameraName} Web-Manager`;
    this.state.status = props.error.status || 500;
    this.state.message = props.error.message ? props.error.message : `${props.error}`;
  }

  render() {
    const classTable = {
      page: classNames('error-page', `error-${this.state.status}`)
    };
    const messageTitle = this.state.status === 404 ? _('Not found this page') : _('The server error');
    const messageSubtitle = this.state.status === 404 ?
      _('Please click the button to go back to home!') :
      _('Sorry for your inconvenience, we are actively process with it!');

    return (
      <div className={classTable.page}>
        <div className="container-fluid">
          <div className="row">
            <div className="col-6 text-right">
              <img src={this.state.status === 404 ? imageCode404 : imageCode500}/>
            </div>
            <div className="col-6 message-container">
              <img src={imageOops}/> <span className="message-title">{messageTitle}</span>
              <p className="message-subtitle">{messageSubtitle}</p>
              <a className="btn btn-primary text-light rounded-pill" href="/">
                {_('Go to home')} <i className="fas fa-arrow-right fa-fw"/>
              </a>
            </div>
            <div className="col-12 text-center icons mb-5">
              <img src={imageError01}/>
              <img src={imageError02}/>
              <img src={imageError03}/>
              <img src={imageError04}/>
              <img src={imageError05}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
