import React, {Component} from 'react';
import PropTypes from 'prop-types';
import progress from 'nprogress';
import sanitizeHtml from 'sanitize-html';
import NotificationFaceRecognitionCondition from 'webserver-form-schema/constants/notification-face-recognition-condition';
import i18n from '../../i18n';
import api from '../../../core/apis/web-api';
import {NOTIFY_CARDS_MAX} from '../../../core/constants';
import notify from '../../../core/notify';
import CardsFilter from './cards-filter';
import CardsForm from './cards-form';
import CardsList from './cards-list';
import CustomTooltip from '../../../core/components/tooltip';
import withGlobalStatus from '../../withGlobalStatus';

export default withGlobalStatus(
  class Cards extends Component {
    static get propTypes() {
      return {
        cards: PropTypes.shape({items: PropTypes.arrayOf(CardsForm.propTypes.cardDetails)}).isRequired,
        groups: PropTypes.shape(CardsForm.propTypes.groups.items).isRequired,
        systemInformation: PropTypes.shape({modelName: PropTypes.string}).isRequired
      };
    }

    state={
      cards: this.props.cards.items,
      isShowCardDetailsModal: false,
      cardDetails: null,
      cardTypeFilter: 'all',
      isTop: false
    }

    onHideCardModal = () => {
      this.setState({isShowCardDetailsModal: false});
    };

    toggleIsTop = () => {
      this.setState(prevState => ({isTop: !prevState.isTop}));
    };

    cardLimitError = () => { // Over card limit 32
      notify.showErrorNotification({
        title: i18n.t('Card Number Limit Exceeded'),
        message: i18n.t('Cannot create more than {{0}} cards', {0: NOTIFY_CARDS_MAX})
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
      return sanitizeHtml(input, {
        allowedTags: [],
        allowedAttributes: {}
      });
    }

    onSubmitCardForm = values => {
      const data = {
        ...values,
        isTop: this.state.isTop,
        groups: values.faceRecognitionCondition === NotificationFaceRecognitionCondition.success ?
          (values.$groups ? [values.$groups] : []) :
          [],
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
              return {
                cards,
                isShowCardDetailsModal: false
              };
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
              return {
                cards,
                isShowCardDetailsModal: false
              };
            });
          })
          .finally(progress.done);
      }
    };

    render() {
      const {cards, isShowCardDetailsModal, cardDetails, cardTypeFilter, $isApiProcessing, isTop} = this.state;
      const {groups, systemInformation: {modelName}} = this.props;
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
                  <CustomTooltip title={i18n.t('Add a New Notification Card')}>
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
                modelName={modelName}
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
  }
);
