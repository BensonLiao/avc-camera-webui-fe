const classNames = require('classnames');
const React = require('react');
const PropTypes = require('prop-types');
const progress = require('nprogress');
const sanitizeHtml = require('sanitize-html');
const NotificationCardType = require('webserver-form-schema/constants/notification-card-type');
const outputIcon = require('../../../resource/icon-output-40px.svg');
const Base = require('../shared/base');
const _ = require('../../../languages');
const utils = require('../../../core/utils');
const api = require('../../../core/apis/web-api');
const CustomTooltip = require('../../../core/components/tooltip');
const {NOTIFY_CARDS_MAX} = require('../../../core/constants');
const CardsForm = require('./cards-form');

module.exports = class Cards extends Base {
  static get propTypes() {
    return {
      cards: PropTypes.shape({
        items: PropTypes.arrayOf(PropTypes.shape({
          id: PropTypes.number.isRequired,
          type: PropTypes.string.isRequired,
          title: PropTypes.string.isRequired
        })).isRequired
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

  cardRender = card => {
    const {groups} = this.props;
    const {$isApiProcessing} = this.state;

    return (
      <div key={card.id} className="card shadow overflow-hidden" onClick={this.generateClickCardHandler(card.id)}>
        <div className="card-title d-flex justify-content-between align-items-center">
          <div className="title text-truncate">
            <CustomTooltip title={card.isTop ? _('Unpin Card') : _('Pin Card')}>
              <button
                disabled={$isApiProcessing} type="button"
                className={classNames('btn btn-star rounded-pill', {'btn-secondary': !card.isTop})}
                onClick={this.generateToggleTopHandler(card.id)}
              >
                <i className="fas fa-bell fa-fw fa-lg"/>
              </button>
            </CustomTooltip>

            <a className="ml-3" href="#">{card.title}</a>
          </div>
          <div className="icons d-flex justify-content-end">
            {
              card.isEnableEmail && (
                <div className="icon rounded-pill d-flex justify-content-center align-items-center">
                  <i className="fas fa-envelope fa-fw fa-lg"/>
                </div>
              )
            }
            {
              card.isEnableGPIO && (
                <div className="icon rounded-pill d-flex justify-content-center align-items-center ml-2">
                  <img src={outputIcon}/>
                </div>
              )
            }
          </div>
        </div>
        <div className="card-body">
          <table>
            <tbody>
              <tr>
                <th>{_('Analytic')}</th>
                <td>{_(`notification-card-${card.type}`)}</td>
              </tr>
              {
                card.timePeriods.map((timePeriod, index) => {
                  const key = `${index}`;

                  return (
                    <tr key={key}>
                      <th>{index === 0 ? _('Schedule') : ''}</th>
                      <td>{`${utils.formatDate(timePeriod.start)} - ${utils.formatDate(timePeriod.end)}`}</td>
                    </tr>
                  );
                })
              }
              <tr>
                <th>{_('Rule')}</th>
                <td>{_(`face-recognition-condition-${card.faceRecognitionCondition}`)}</td>
              </tr>
            </tbody>
          </table>
          <div className="chips-wrapper">
            <div className="chips">
              {
                card.groups.slice(0, 2).map(groupId => {
                  const group = groups.items.find(x => x.id === groupId);
                  return (
                    <span key={groupId} className="border border-primary rounded-pill text-primary">
                      {group ? group.name : ''}
                    </span>
                  );
                })
              }
            </div>
            {
              card.groups.length > 2 && (
                <div className="chips-sum-extra">
                  <span className="border border-primary rounded-pill text-primary">+{card.groups.length - 2}</span>
                </div>
              )
            }
          </div>
          <button
            disabled={$isApiProcessing} type="button"
            className="btn btn-secondary rounded-circle btn-delete"
            onClick={this.generateDeleteCardHandler(card.id)}
          >
            <i className="far fa-trash-alt fa-lg"/>
          </button>
        </div>
      </div>
    );
  };

  render() {
    const {cards, isShowCardDetailsModal, cardDetails, cardTypeFilter, $isApiProcessing, isTop} = this.state;
    const {groups} = this.props;
    const filterCards = cardTypeFilter === 'all' ? cards : cards.filter(x => x.type === cardTypeFilter);
    const topCards = filterCards.filter(x => x.isTop);
    const normalCards = filterCards.filter(x => !x.isTop);
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
                    {active: cardTypeFilter === NotificationCardType.faceRecognition},
                    {'btn-primary': cardTypeFilter === NotificationCardType.faceRecognition}
                  )} type="button"
                  onClick={this.generateChangeNotificationCardTypeFilter(NotificationCardType.faceRecognition)}
                >{_(`notification-card-${NotificationCardType.faceRecognition}`)}
                </button>
                <button
                  className={classNames(
                    'btn rounded-pill shadow-sm ml-4',
                    {active: cardTypeFilter === NotificationCardType.motionDetection},
                    {'btn-primary': cardTypeFilter === NotificationCardType.motionDetection}
                  )} type="button"
                  onClick={this.generateChangeNotificationCardTypeFilter(NotificationCardType.motionDetection)}
                >{_(`notification-card-${NotificationCardType.motionDetection}`)}
                </button>
                <button
                  className={classNames(
                    'btn rounded-pill shadow-sm ml-4',
                    {active: cardTypeFilter === NotificationCardType.digitalInput},
                    {'btn-primary': cardTypeFilter === NotificationCardType.digitalInput}
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
                      {topCards.map(this.cardRender)}
                    </div>
                  </>
                )
              }

              <h3 className="mb-2">{_('Others')}</h3>
              <hr className="my-1"/>

              <div className="card-container mb-4">
                {normalCards.map(this.cardRender)}
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
