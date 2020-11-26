import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import i18n from '../../../i18n';
import NotificationCardType from 'webserver-form-schema/constants/notification-card-type';

const CardsFilter = ({cardTypeFilter, setCardTypeFilter}) => {
  const cardTypeCheck = {
    faceRecognition: cardTypeFilter === NotificationCardType.faceRecognition,
    motionDetection: cardTypeFilter === NotificationCardType.motionDetection,
    digitalInput: cardTypeFilter === NotificationCardType.digitalInput
  };

  const changeCardTypeFilter = cardType => {
    return event => {
      event.preventDefault();
      setCardTypeFilter(cardType);
    };
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
};

CardsFilter.propTypes = {
  cardTypeFilter: PropTypes.string.isRequired,
  setCardTypeFilter: PropTypes.func.isRequired
};

export default CardsFilter;
