const React = require('react');
const {store} = require('react-notifications-component');
const {default: i18n} = require('../web/i18n');

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
            <div><strong>{title || i18n.t('Success')}</strong></div>
            <div className="text-muted">{message || i18n.t('Server Process Success')}</div>
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
            <div><strong>{title || i18n.t('Error')}</strong></div>
            <div className="text-muted">{message || i18n.t('Internal Server Error')}</div>
          </div>
        </div>
      )
    });
  }
};
