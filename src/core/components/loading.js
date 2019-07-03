const React = require('react');
const _ = require('../../languages');

module.exports = class Loading extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div className="page-loading d-flex justify-content-center align-items-center">
        <div className="spinner-container">
          <div className="spinner-wrapper text-primary">
            <div className="spinner-border">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
          <div className="description">
            <p>{_('Loading')}<span className="dotty"/></p>
          </div>
        </div>
      </div>
    );
  }
};
