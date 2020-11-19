/* eslint-disable react/prop-types */
import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {getRouter} from 'capybara-router';
import progress from 'nprogress';
import sanitizeHtml from 'sanitize-html';
import NotificationFaceRecognitionCondition from 'webserver-form-schema/constants/notification-face-recognition-condition';
import i18n from '../../../i18n';
import api from '../../../core/apis/web-api';
import {NOTIFY_CARDS_MAX} from '../../../core/constants';
import notify from '../../../core/notify';
import CardsFilter from './cards-filter';
import CardsForm from './cards-form';
import CardsList from './cards-list';
import CustomTooltip from '../../../core/components/tooltip';
import withGlobalStatus from '../../withGlobalStatus';
import {useContextState} from '../../stateProvider';

const Cards = ({groups, cards: {items: cards}, systemInformation: {modelName}}) => {
  const {isApiProcessing} = useContextState();

  const [state, setState] = useState({
    cardDetails: null,
    cardTypeFilter: 'all',
    isTop: false
  });
  const {cardDetails, cardTypeFilter, isTop} = state;

  const [isShowCardDetailsModal, setIsShowCardDetailsModal] = useState(false);

  const toggleIsTop = () => {
    setState(prevState => ({
      ...prevState,
      isTop: !prevState.isTop
    }));
  };

  const cardLimitError = () => { // Over card limit 32
    notify.showErrorNotification({
      title: i18n.t('Card Number Limit Exceeded'),
      message: i18n.t('Cannot create more than {{0}} cards', {0: NOTIFY_CARDS_MAX})
    });
  };

  const changeCardTypeFilter = cardType => {
    return event => {
      event.preventDefault();
      setState(prevState => ({
        ...prevState,
        cardTypeFilter: cardType
      }));
    };
  };

  const deleteCardHandler = cardId => event => {
    event.preventDefault();
    event.stopPropagation();
    progress.start();
    api.notification.deleteCard(cardId)
      .then(getRouter().reload)
      .finally(progress.done);
  };

  const toggleIsTopHandler = cardId => event => {
    event.preventDefault();
    event.stopPropagation();
    const card = {...cards.find(x => x.id === cardId)};
    card.isTop = !card.isTop;
    progress.start();
    api.notification.updateCard(card)
      .then(getRouter().reload)
      .finally(progress.done);
  };

  const clickCardHandler = cardId => event => {
    event.preventDefault();
    if (cardId == null) {
      if (cards.length >= NOTIFY_CARDS_MAX) {
        cardLimitError();
        return;
      }

      setState(prevState => ({
        ...prevState,
        cardDetails: null,
        isTop: false
      }));
      setIsShowCardDetailsModal(true);
    } else {
      setState(prevState => {
        const card = cards.find(x => x.id === cardId);
        if (card) {
          setIsShowCardDetailsModal(true);
          return {
            ...prevState,
            cardDetails: card,
            isTop: card.isTop
          };
        }
      });
    }
  };

  const sanitizeInput = input => {
    return sanitizeHtml(input, {
      allowedTags: [],
      allowedAttributes: {}
    });
  };

  const onSubmitCardForm = values => {
    const data = {
      ...values,
      isTop: isTop,
      groups: values.faceRecognitionCondition === NotificationFaceRecognitionCondition.success ?
        (values.$groups ? [values.$groups] : []) :
        [],
      title: sanitizeInput(values.title)
    };

    if (data.id == null) {
      // Create a new card.
      if (cards.length >= NOTIFY_CARDS_MAX) {
        cardLimitError();
        return;
      }

      progress.start();
      api.notification.addCard(data)
        .then(setIsShowCardDetailsModal(false))
        .then(getRouter().reload)
        .finally(progress.done);
    } else {
      // Update the card.
      progress.start();
      api.notification.updateCard(data)
        .then(setIsShowCardDetailsModal(false))
        .then(getRouter().reload)
        .finally(progress.done);
    }
  };

  return (
    <>
      <div className="main-content left-menu-active  fixed-top-horizontal-scroll">
        <div className="page-notification pt-0 pb-0">
          <div className="container-fluid">
            <CardsFilter
              cardTypeFilter={cardTypeFilter}
              changeCardTypeFilter={changeCardTypeFilter}
            />
          </div>
        </div>
      </div>
      <div className="main-content left-menu-active">
        <div className="page-notification pt-0">
          <div className="container-fluid">
            <CardsList
              cards={cards}
              groups={groups}
              cardTypeFilter={cardTypeFilter}
              isApiProcessing={isApiProcessing}
              clickCardHandler={clickCardHandler}
              toggleIsTopHandler={toggleIsTopHandler}
              deleteCardHandler={deleteCardHandler}
            />
            <CardsForm
              groups={groups}
              cardDetails={cardDetails}
              modelName={modelName}
              isApiProcessing={isApiProcessing}
              isShowCardDetailsModal={isShowCardDetailsModal}
              isTop={isTop}
              toggleIsTop={toggleIsTop}
              sanitizeInput={sanitizeInput}
              onHideCardModal={() => setIsShowCardDetailsModal(false)}
              onSubmit={onSubmitCardForm}
            />
            <div className="fixed-actions-section fixed-bottom text-center pb-5" style={{pointerEvents: 'none'}}>
              <CustomTooltip title={i18n.t('Add a New Notification Card')}>
                <button
                  className="btn btn-outline-primary btn-lg bg-white text-primary border-0 rounded-circle shadow"
                  type="button"
                  style={{pointerEvents: 'auto'}}
                  onClick={clickCardHandler()}
                >
                  <i className="fas fa-plus"/>
                </button>
              </CustomTooltip>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

Cards.propTypes = {
  cards: PropTypes.shape({items: PropTypes.arrayOf(CardsForm.propTypes.cardDetails)}).isRequired,
  groups: PropTypes.shape(CardsForm.propTypes.groups.items).isRequired,
  systemInformation: PropTypes.shape({modelName: PropTypes.string}).isRequired
};

export default withGlobalStatus(Cards);
