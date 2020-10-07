const React = require('react');
const PropTypes = require('prop-types');
const i18n = require('../../i18n').default;
const CardsListSingleCard = require('./cards-list-single-card');

module.exports = class CardsList extends React.PureComponent {
  static get propTypes() {
    return {
      cards: PropTypes.arrayOf(
        PropTypes.shape(CardsListSingleCard.propTypes.card).isRequired
      ).isRequired,
      groups: PropTypes.shape(CardsListSingleCard.propTypes.groups).isRequired,
      isApiProcessing: PropTypes.bool.isRequired,
      cardTypeFilter: PropTypes.string.isRequired,
      clickCardHandler: PropTypes.func.isRequired,
      deleteCardHandler: PropTypes.func.isRequired,
      toggleIsTopHandler: PropTypes.func.isRequired
    };
  }

  render() {
    const {cards, groups, cardTypeFilter, isApiProcessing, clickCardHandler, deleteCardHandler, toggleIsTopHandler} = this.props;
    const filterCards = cardTypeFilter === 'all' ? cards : cards.filter(x => x.type === cardTypeFilter);
    const topCards = filterCards.filter(x => x.isTop);
    const normalCards = filterCards.filter(x => !x.isTop);
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
  }
};

