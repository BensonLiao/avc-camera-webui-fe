const classNames = require('classnames');
const React = require('react');
const PropTypes = require('prop-types');
const imageCode404 = require('../../../resource/error-404-code.svg');
const imageCode500 = require('../../../resource/error-500-code.svg');
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
    const messageTitle = this.state.status === 404 ? _('Not Found') : _('The Server Error');

    return (
      <div className={classTable.page}>
        <div className="container-fluid">
          <div className="row">
            <div className="col-6 text-right">
              <img src={this.state.status === 404 ? imageCode404 : imageCode500}/>
            </div>
            <div className="col-6 message-container">
              <span className="message-title">{messageTitle}</span>
              <a className="btn btn-primary text-light rounded-pill" href="/">
                {_('Back to Home')} <i className="fas fa-arrow-right fa-fw"/>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
