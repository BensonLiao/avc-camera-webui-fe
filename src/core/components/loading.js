const React = require('react');
const i18n = require('../../i18n').default;

module.exports = class Loading extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div className="page-loading d-flex justify-content-center align-items-center">
        <div className="spinner-container">
          <div className="spinner">
            <div className="bounce1"/>
            <div className="bounce2"/>
            <div className="bounce3"/>
          </div>
          <div className="description">
            <p className="mt-4">{i18n.t('Loading')}</p>
          </div>
        </div>
      </div>
    );
  }
};
