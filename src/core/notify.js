const React = require('react');
const {store} = require('react-notifications-component');
const i18n = require('../i18n').default;

module.exports = {
  /**
   * @param {string} title - The success title.
   * @param {string} message - The success message.
   * @returns {undefined}
   */
  showSuccessNotification: ({title, message}) => {
    store.addNotification({
      type: 'default',
      insert: 'top',
      container: 'top-right',
      animationIn: ['animated', 'faster', 'slideInRight'],
      animationOut: ['animated', 'faster', 'slideOutRight'],
      dismiss: {duration: 5000},
      content: () => (
        <div className="d-flex bg-white rounded p-3">
          <div><i className="fas fa-check-circle fa-lg text-success"/></div>
          <div className="d-flex flex-column ml-3">
            <div><strong>{i18n.t(title || 'Setting Success')}</strong></div>
            <div className="text-muted">{i18n.t(message || 'Server Process Success')}</div>
          </div>
        </div>
      )
    });
  },

  /**
   * @param {string} title - The error title.
   * @param {string} message - The error message.
   * @returns {undefined}
   */
  showErrorNotification: ({title, message}) => {
    store.addNotification({
      type: 'default',
      insert: 'top',
      container: 'top-right',
      animationIn: ['animated', 'faster', 'slideInRight'],
      animationOut: ['animated', 'faster', 'slideOutRight'],
      dismiss: {duration: 5000},
      content: () => (
        <div className="d-flex bg-white rounded p-3">
          <div><i className="fas fa-times-circle fa-lg text-danger"/></div>
          <div className="d-flex flex-column ml-3">
            <div><strong>{i18n.t(title || 'Error')}</strong></div>
            <div className="text-muted">{i18n.t(message || 'Internal Server Error')}</div>
          </div>
        </div>
      )
    });
  }
};
