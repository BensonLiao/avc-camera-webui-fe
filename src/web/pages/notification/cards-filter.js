const classNames = require('classnames');
const React = require('react');
const PropTypes = require('prop-types');
const _ = require('../../../languages');
const NotificationCardType = require('webserver-form-schema/constants/notification-card-type');

module.exports = class CardsFilter extends React.PureComponent {
  static get propTypes() {
    return {
      cardTypeFilter: PropTypes.string.isRequired,
      changeCardTypeFilter: PropTypes.func.isRequired
    };
  }

  render() {
    const {cardTypeFilter, changeCardTypeFilter} = this.props;
    const cardTypeCheck = {
      faceRecognition: cardTypeFilter === NotificationCardType.faceRecognition,
      motionDetection: cardTypeFilter === NotificationCardType.motionDetection,
      digitalInput: cardTypeFilter === NotificationCardType.digitalInput
    };

    return (

      <div className="filter d-flex align-items-center text-nowrap mb-0">
        <label className="mb-0">{_('Notification Filters')}</label>
        <button
          className={classNames(
            'btn rounded-pill chips-outline shadow-sm ml-4',
            {active: cardTypeFilter === 'all'}
          )}
          type="button"
          onClick={changeCardTypeFilter('all')}
        >{_('notification-card-filter-all')}
        </button>
        <button
          className={classNames(
            'btn rounded-pill chips-outline shadow-sm ml-4',
            {active: cardTypeCheck.faceRecognition}
          )}
          type="button"
          onClick={changeCardTypeFilter(NotificationCardType.faceRecognition)}
        >{_(`notification-card-${NotificationCardType.faceRecognition}`)}
        </button>
        <button
          className={classNames(
            'btn rounded-pill chips-outline shadow-sm ml-4',
            {active: cardTypeCheck.motionDetection}
          )}
          type="button"
          onClick={changeCardTypeFilter(NotificationCardType.motionDetection)}
        >{_(`notification-card-${NotificationCardType.motionDetection}`)}
        </button>
        <button
          className={classNames(
            'btn rounded-pill chips-outline shadow-sm ml-4',
            {active: cardTypeCheck.digitalInput}
          )}
          type="button"
          onClick={changeCardTypeFilter(NotificationCardType.digitalInput)}
        >{_(`notification-card-${NotificationCardType.digitalInput}`)}
        </button>
      </div>

    );
  }
};

