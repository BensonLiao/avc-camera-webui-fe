const React = require('react');
const PropTypes = require('prop-types');
const progress = require('nprogress');
const sanitizeHtml = require('sanitize-html');
const _ = require('../../../languages');
const api = require('../../../core/apis/web-api');
const Base = require('../shared/base');
const {NOTIFY_CARDS_MAX} = require('../../../core/constants');
const notify = require('../../../core/notify');
const CardsFilter = require('./cards-filter');
const CardsForm = require('./cards-form');
const CardsList = require('./cards-list');
const CustomTooltip = require('../../../core/components/tooltip');

module.exports = class Cards extends Base {
  static get propTypes() {
    return {
      cards: PropTypes.shape({
        items: PropTypes.arrayOf(PropTypes.shape({
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
        })).isRequired
      }).isRequired,
      groups: PropTypes.shape({
        items: PropTypes.arrayOf(PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          note: PropTypes.string.isRequired
        }).isRequired)
      }).isRequired
    };
  }

  constructor(props) {
    super(props);
    this.state.cards = this.props.cards.items;
    this.state.isShowCardDetailsModal = false;
    this.state.cardDetails = null;
    this.state.cardTypeFilter = 'all';
    this.state.isTop = false;
  }

  onHideCardModal = () => {
    this.setState({isShowCardDetailsModal: false});
  };

  toggleIsTop = () => {
    this.setState(prevState => ({isTop: !prevState.isTop}));
  };

  cardLimitError = () => { // Over card limit 32
    notify.showErrorNotification({
      title: _('Cards Limit Error'),
      message: _('Cannot create more than {0} cards', [NOTIFY_CARDS_MAX])
    });
  }

  changeCardTypeFilter = cardType => {
    return event => {
      event.preventDefault();
      this.setState({cardTypeFilter: cardType});
    };
  }

  deleteCardHandler = cardId => event => {
    event.preventDefault();
    event.stopPropagation();
    progress.start();
    api.notification.deleteCard(cardId)
      .then(() => this.setState(prevState => {
        const cards = [...prevState.cards];
        const index = cards.findIndex(x => x.id === cardId);

        if (index >= 0) {
          cards.splice(index, 1);
          return {cards};
        }
      }))
      .finally(progress.done);
  };

  toggleIsTopHandler = cardId => event => {
    event.preventDefault();
    event.stopPropagation();
    const card = {...this.state.cards.find(x => x.id === cardId)};
    card.isTop = !card.isTop;
    progress.start();
    api.notification.updateCard(card)
      .then(response => this.setState(prevState => {
        const cards = [...prevState.cards];
        const index = cards.findIndex(x => x.id === cardId);

        if (index >= 0) {
          cards.splice(index, 1, response.data);
          return {cards};
        }
      }))
      .finally(progress.done);
  };

  clickCardHandler = cardId => event => {
    event.preventDefault();
    if (cardId == null) {
      if (this.state.cards.length >= NOTIFY_CARDS_MAX) {
        this.cardLimitError();
        return;
      }

      this.setState({
        isShowCardDetailsModal: true,
        cardDetails: null,
        isTop: false
      });
    } else {
      this.setState(prevState => {
        const card = prevState.cards.find(x => x.id === cardId);
        if (card) {
          return {
            isShowCardDetailsModal: true,
            cardDetails: card,
            isTop: card.isTop
          };
        }
      });
    }
  };

  sanitizeInput = input => {
    return sanitizeHtml(input, {allowedTags: [], allowedAttributes: {}});
  }

  onSubmitCardForm = values => {
    const data = {
      ...values,
      isTop: this.state.isTop,
      groups: values.$groups ? [values.$groups] : [],
      title: this.sanitizeInput(values.title)
    };

    if (data.id == null) {
      // Create a new card.
      if (this.state.cards.length >= NOTIFY_CARDS_MAX) {
        this.cardLimitError();
        return;
      }

      progress.start();
      api.notification.addCard(data)
        .then(response => {
          this.setState(prevState => {
            const cards = [...prevState.cards];
            cards.push(response.data);
            return {cards, isShowCardDetailsModal: false};
          });
        })
        .finally(progress.done);
    } else {
      // Update the card.
      progress.start();
      api.notification.updateCard(data)
        .then(response => {
          this.setState(prevState => {
            const cards = [...prevState.cards];
            const index = cards.findIndex(x => x.id === data.id);
            cards.splice(index, 1, response.data);
            return {cards, isShowCardDetailsModal: false};
          });
        })
        .finally(progress.done);
    }
  };

  render() {
    const {cards, isShowCardDetailsModal, cardDetails, cardTypeFilter, $isApiProcessing, isTop} = this.state;
    const {groups} = this.props;
    return (
      <>
        <div className="main-content left-menu-active  fixed-top-horizontal-scroll">
          <div className="page-notification pt-0 pb-0">
            <div className="container-fluid">
              <CardsFilter
                cardTypeFilter={cardTypeFilter}
                changeCardTypeFilter={this.changeCardTypeFilter}
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
                isApiProcessing={$isApiProcessing}
                clickCardHandler={this.clickCardHandler}
                toggleIsTopHandler={this.toggleIsTopHandler}
                deleteCardHandler={this.deleteCardHandler}
              />
              <div className="fixed-actions-section fixed-bottom text-center pb-5" style={{pointerEvents: 'none'}}>
                <CustomTooltip title={_('Add New Notification Card')}>
                  <button
                    className="btn btn-outline-primary btn-lg bg-white text-primary border-0 rounded-circle shadow"
                    type="button"
                    style={{pointerEvents: 'auto'}}
                    onClick={this.clickCardHandler()}
                  >
                    <i className="fas fa-plus"/>
                  </button>
                </CustomTooltip>
              </div>
            </div>
            <CardsForm
              groups={groups}
              cardDetails={cardDetails}
              isApiProcessing={$isApiProcessing}
              isShowCardDetailsModal={isShowCardDetailsModal}
              isTop={isTop}
              toggleIsTop={this.toggleIsTop}
              sanitizeInput={this.sanitizeInput}
              onHideCardModal={this.onHideCardModal}
              onSubmit={this.onSubmitCardForm}
            />
          </div>
        </div>
      </>
    );
  }
};
