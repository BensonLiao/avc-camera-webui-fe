import React from 'react';
import PropTypes from 'prop-types';
import {getRouter} from 'capybara-router';
import progress from 'nprogress';
import api from '../../../core/apis/web-api';
import i18n from '../../../i18n';
import CardsListSingleCard from './cards-list-single-card';

const CardsList = ({cards, groups, cardTypeFilter, isApiProcessing, clickCardHandler, deleteCardHandler}) => {
  const filterCards = cardTypeFilter === 'all' ? cards : cards.filter(x => x.type === cardTypeFilter);
  const topCards = filterCards.filter(x => x.isTop);
  const normalCards = filterCards.filter(x => !x.isTop);

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

  return (
    <>
      {
        topCards.length > 0 && (
          <>
            <h3 className="mb-2">{i18n.t('Pinned')}</h3>
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
                  deleteCardHandler={deleteCardHandler}
                />
              ))}
            </div>
          </>
        )
      }
      <h3 className="mb-2">{i18n.t('Others')}</h3>
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
            deleteCardHandler={deleteCardHandler}
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
  clickCardHandler: PropTypes.func.isRequired,
  deleteCardHandler: PropTypes.func.isRequired
};

export default CardsList;
