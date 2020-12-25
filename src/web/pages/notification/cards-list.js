import {getRouter} from '@benson.liao/capybara-router';
import progress from 'nprogress';
import PropTypes from 'prop-types';
import React from 'react';
import api from '../../../core/apis/web-api';
import CardsListSingleCard from './cards-list-single-card';
import i18n from '../../../i18n';
import utils from '../../../core/utils';

const CardsList = ({cards, groups, cardTypeFilter, isApiProcessing, clickCardHandler}) => {
  const filterCards = cardTypeFilter === 'all' ? cards : cards.filter(x => x.type === cardTypeFilter);
  const topCards = filterCards.filter(x => x.isTop);
  const normalCards = filterCards.filter(x => !x.isTop);

  const toggleIsTopHandler = cardId => event => {
    event.stopPropagation();
    const card = {...cards.find(x => x.id === cardId)};
    card.isTop = !card.isTop;
    const data = {
      ...card,
      timePeriods: utils.parseCardTimePeriods(card)
    };
    progress.start();
    api.notification.updateCard(data)
      .then(getRouter().reload)
      .finally(progress.done);
  };

  return (
    <>
      {
        topCards.length > 0 && (
          <>
            <h3 className="mb-2">{i18n.t('notification.cards.pinned')}</h3>
            <hr className="my-1"/>
            <div className="card-container">
              {topCards.map(card => (
                <CardsListSingleCard
                  key={card.id}
                  card={card}
                  groups={groups}
                  isApiProcessing={isApiProcessing}
                  clickCardHandler={clickCardHandler}
                  toggleIsTopHandler={toggleIsTopHandler}
                />
              ))}
            </div>
          </>
        )
      }
      <h3 className="mb-2">{i18n.t('notification.cards.others')}</h3>
      <hr className="my-1"/>
      <div className="card-container mb-4">
        {normalCards.map(card => (
          <CardsListSingleCard
            key={card.id}
            card={card}
            groups={groups}
            isApiProcessing={isApiProcessing}
            clickCardHandler={clickCardHandler}
            toggleIsTopHandler={toggleIsTopHandler}
          />
        ))}
      </div>
    </>
  );
};

CardsList.propTypes = {
  cards: PropTypes.arrayOf(
    PropTypes.shape(CardsListSingleCard.propTypes.card).isRequired
  ).isRequired,
  groups: PropTypes.shape(CardsListSingleCard.propTypes.groups).isRequired,
  isApiProcessing: PropTypes.bool.isRequired,
  cardTypeFilter: PropTypes.string.isRequired,
  clickCardHandler: PropTypes.func.isRequired
};

export default CardsList;
