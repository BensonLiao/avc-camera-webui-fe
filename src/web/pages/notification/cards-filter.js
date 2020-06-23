const classNames = require('classnames');
const React = require('react');
const PropTypes = require('prop-types');
const _ = require('../../../languages');
const NotificationCardType = require('webserver-form-schema/constants/notification-card-type');

module.exports = class CardsFilter extends React.PureComponent {
  static get propTypes() {
    return {
      cardTypeFilter: PropTypes.string.isRequired,
      generateChangeNotificationCardTypeFilter: PropTypes.func.isRequired
    };
  }

  render() {
    const {cardTypeFilter, generateChangeNotificationCardTypeFilter} = this.props;
    const cardTypeCheck = {
      faceRecognition: cardTypeFilter === NotificationCardType.faceRecognition,
      motionDetection: cardTypeFilter === NotificationCardType.motionDetection,
      digitalInput: cardTypeFilter === NotificationCardType.digitalInput
    };

    return (
      <div className="page-notification pt-0 pb-0">
        <div className="container-fluid">
          <div className="filter d-flex align-items-center text-nowrap mb-0">
            <label className="mb-0">{_('Notification Filters')}</label>
            <button
              className={classNames(
                'btn rounded-pill shadow-sm ml-4',
                {active: cardTypeFilter === 'all'},
                {'btn-primary': cardTypeFilter === 'all'}
              )} type="button"
              onClick={generateChangeNotificationCardTypeFilter('all')}
            >{_('notification-card-filter-all')}
            </button>
            <button
              className={classNames(
                'btn rounded-pill shadow-sm ml-4',
                {active: cardTypeCheck.faceRecognition},
                {'btn-primary': cardTypeCheck.faceRecognition}
              )} type="button"
              onClick={generateChangeNotificationCardTypeFilter(NotificationCardType.faceRecognition)}
            >{_(`notification-card-${NotificationCardType.faceRecognition}`)}
            </button>
            <button
              className={classNames(
                'btn rounded-pill shadow-sm ml-4',
                {active: cardTypeCheck.motionDetection},
                {'btn-primary': cardTypeCheck.motionDetection}
              )} type="button"
              onClick={generateChangeNotificationCardTypeFilter(NotificationCardType.motionDetection)}
            >{_(`notification-card-${NotificationCardType.motionDetection}`)}
            </button>
            <button
              className={classNames(
                'btn rounded-pill shadow-sm ml-4',
                {active: cardTypeCheck.digitalInput},
                {'btn-primary': cardTypeCheck.digitalInput}
              )} type="button"
              onClick={generateChangeNotificationCardTypeFilter(NotificationCardType.digitalInput)}
            >{_(`notification-card-${NotificationCardType.digitalInput}`)}
            </button>
          </div>
        </div>
      </div>
    );
  }
};

