const classNames = require('classnames');
const React = require('react');
const PropTypes = require('prop-types');
const progress = require('nprogress');
const sanitizeHtml = require('sanitize-html');
const NotificationCardType = require('webserver-form-schema/constants/notification-card-type');
const Base = require('../shared/base');
const _ = require('../../../languages');
const api = require('../../../core/apis/web-api');
const CardsForm = require('./cards-form');
const {NOTIFY_CARDS_MAX} = require('../../../core/constants');
const utils = require('../../../core/utils');
const CardsSingleCard = require('./cards-single-card');

module.exports = class Cards extends Base {
  static get propTypes() {
    return {
      cards: PropTypes.shape({
        items: PropTypes.arrayOf(PropTypes.shape({
          id: PropTypes.number.isRequired,
          type: PropTypes.string.isRequired,
          title: PropTypes.string.isRequired
        })).isRequired
      }).isRequired,
      groups: PropTypes.shape({
        items: PropTypes.array
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
    this.setState(
      prevState => ({
        isTop: !prevState.isTop
      })
    );
  };

  cardLimitError = () => { // Over card limit 32
    utils.showErrorNotification({
      title: _('Cards Limit Error'),
      message: _('Cannot create more than {0} cards', [NOTIFY_CARDS_MAX])
    });
  }

  generateChangeNotificationCardTypeFilter = cardType => {
    return event => {
      event.preventDefault();
      this.setState({cardTypeFilter: cardType});
    };
  }

  generateDeleteCardHandler = cardId => event => {
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

  generateToggleTopHandler = cardId => event => {
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

  generateClickCardHandler = cardId => event => {
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
    if (data.type === NotificationCardType.digitalInput) {
      data.isEnableVMS = false;
    }

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
    const filterCards = cardTypeFilter === 'all' ? cards : cards.filter(x => x.type === cardTypeFilter);
    const topCards = filterCards.filter(x => x.isTop);
    const normalCards = filterCards.filter(x => !x.isTop);
    const cardTypeCheck = {
      faceRecognition: cardTypeFilter === NotificationCardType.faceRecognition,
      motionDetection: cardTypeFilter === NotificationCardType.motionDetection,
      digitalInput: cardTypeFilter === NotificationCardType.digitalInput
    };
    return (
      <>
        <div className="main-content left-menu-active  fixed-top-horizontal-scroll">
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
                  onClick={this.generateChangeNotificationCardTypeFilter('all')}
                >{_('notification-card-filter-all')}
                </button>
                <button
                  className={classNames(
                    'btn rounded-pill shadow-sm ml-4',
                    {active: cardTypeCheck.faceRecognition},
                    {'btn-primary': cardTypeCheck.faceRecognition}
                  )} type="button"
                  onClick={this.generateChangeNotificationCardTypeFilter(NotificationCardType.faceRecognition)}
                >{_(`notification-card-${NotificationCardType.faceRecognition}`)}
                </button>
                <button
                  className={classNames(
                    'btn rounded-pill shadow-sm ml-4',
                    {active: cardTypeCheck.motionDetection},
                    {'btn-primary': cardTypeCheck.motionDetection}
                  )} type="button"
                  onClick={this.generateChangeNotificationCardTypeFilter(NotificationCardType.motionDetection)}
                >{_(`notification-card-${NotificationCardType.motionDetection}`)}
                </button>
                <button
                  className={classNames(
                    'btn rounded-pill shadow-sm ml-4',
                    {active: cardTypeCheck.digitalInput},
                    {'btn-primary': cardTypeCheck.digitalInput}
                  )} type="button"
                  onClick={this.generateChangeNotificationCardTypeFilter(NotificationCardType.digitalInput)}
                >{_(`notification-card-${NotificationCardType.digitalInput}`)}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="main-content left-menu-active">
          <div className="page-notification pt-0">
            <div className="container-fluid">
              {
                topCards.length > 0 && (
                  <>
                    <h3 className="mb-2">{_('Pinned')}</h3>
                    <hr className="my-1"/>
                    <div className="card-container">
                      {topCards.map(card => (
                        <CardsSingleCard
                          key={card.id}
                          card={card}
                          groups={groups}
                          isApiProcessing={$isApiProcessing}
                          generateClickCardHandler={this.generateClickCardHandler}
                          generateToggleTopHandler={this.generateToggleTopHandler}
                          generateDeleteCardHandler={this.generateDeleteCardHandler}
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
                  <CardsSingleCard
                    key={card.id}
                    card={card}
                    groups={groups}
                    isApiProcessing={$isApiProcessing}
                    generateClickCardHandler={this.generateClickCardHandler}
                    generateToggleTopHandler={this.generateToggleTopHandler}
                    generateDeleteCardHandler={this.generateDeleteCardHandler}
                  />
                ))}
              </div>

              <div className="fixed-actions-section fixed-bottom text-center pb-5">
                <button className="btn btn-outline-primary btn-lg bg-white text-primary border-0 rounded-circle shadow"
                  type="button" onClick={this.generateClickCardHandler()}
                >
                  <i className="fas fa-plus"/>
                </button>
              </div>
            </div>

            {/* Card Form Modal */}
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
