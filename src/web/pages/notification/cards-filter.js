const classNames = require('classnames');
const React = require('react');
const PropTypes = require('prop-types');
const i18n = require('../../../i18n').default;
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
        <label className="mb-0">{i18n.t('Notification Filters')}</label>
        <button
          className={classNames(
            'btn rounded-pill chips-outline shadow-sm ml-4',
            {active: cardTypeFilter === 'all'}
          )}
          type="button"
          onClick={changeCardTypeFilter('all')}
        >{i18n.t('notification-card-filter-all')}
        </button>
        <button
          className={classNames(
            'btn rounded-pill chips-outline shadow-sm ml-4',
            {active: cardTypeCheck.faceRecognition}
          )}
          type="button"
          onClick={changeCardTypeFilter(NotificationCardType.faceRecognition)}
        >{i18n.t(`notification-card-${NotificationCardType.faceRecognition}`)}
        </button>
        <button
          className={classNames(
            'btn rounded-pill chips-outline shadow-sm ml-4',
            {active: cardTypeCheck.motionDetection}
          )}
          type="button"
          onClick={changeCardTypeFilter(NotificationCardType.motionDetection)}
        >{i18n.t(`notification-card-${NotificationCardType.motionDetection}`)}
        </button>
        <button
          className={classNames(
            'btn rounded-pill chips-outline shadow-sm ml-4',
            {active: cardTypeCheck.digitalInput}
          )}
          type="button"
          onClick={changeCardTypeFilter(NotificationCardType.digitalInput)}
        >{i18n.t(`notification-card-${NotificationCardType.digitalInput}`)}
        </button>
      </div>

    );
  }
};

