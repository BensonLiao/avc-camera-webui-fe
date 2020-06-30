const React = require('react');
const PropTypes = require('prop-types');
const _ = require('../../../languages');
const CardsListSingleCard = require('./cards-list-single-card');

module.exports = class CardsList extends React.PureComponent {
  static get propTypes() {
    return {
      cards: PropTypes.arrayOf(
        PropTypes.shape({
          emailAttachmentType: PropTypes.string.isRequired,
          emails: PropTypes.array.isRequired,
          faceRecognitionCondition: PropTypes.string.isRequired,
          groups: PropTypes.array.isRequired,
          id: PropTypes.number.isRequired,
          isEnableApp: PropTypes.bool.isRequired,
          isEnableEmail: PropTypes.bool.isRequired,
          isEnableFaceRecognition: PropTypes.bool.isRequired,
          isEnableGPIO: PropTypes.bool.isRequired,
          isEnableGPIO1: PropTypes.bool.isRequired,
          isEnableGPIO2: PropTypes.bool.isRequired,
          isEnableTime: PropTypes.bool.isRequired,
          isTop: PropTypes.bool.isRequired,
          timePeriods: PropTypes.array.isRequired,
          title: PropTypes.string.isRequired,
          type: PropTypes.string.isRequired
        }).isRequired
      ).isRequired,
      groups: PropTypes.shape({
        items: PropTypes.arrayOf(PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          note: PropTypes.string.isRequired
        }).isRequired)
      }).isRequired,
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
              <h3 className="mb-2">{_('Pinned')}</h3>
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
        <h3 className="mb-2">{_('Others')}</h3>
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

