import React, {useState} from 'react';
import PropTypes from 'prop-types';
import i18n from '../../../i18n';
import {NOTIFY_CARDS_MAX} from '../../../core/constants';
import notify from '../../../core/notify';
import CardsFilter from './cards-filter';
import CardsForm from './cards-form';
import CardsList from './cards-list';
import CustomTooltip from '../../../core/components/tooltip';
import withGlobalStatus from '../../withGlobalStatus';
import {useContextState} from '../../stateProvider';

const Cards = ({groups, systemInformation: {modelName}, cards: {items: cards}}) => {
  const {isApiProcessing} = useContextState();

  const [isShowCardDetailsModal, setIsShowCardDetailsModal] = useState(false);
  const [cardTypeFilter, setCardTypeFilter] = useState('all');
  const [cardDetails, setCardDetails] = useState(null);
  const [isTop, setIsTop] = useState(false);

  const cardLimitError = () => { // Over card limit 32
    notify.showErrorNotification({
      title: i18n.t('Card Number Limit Exceeded'),
      message: i18n.t('Cannot create more than {{0}} cards', {0: NOTIFY_CARDS_MAX})
    });
  };

  const clickCardHandler = cardId => event => {
    event.preventDefault();
    if (cardId == null) {
      if (cards.length >= NOTIFY_CARDS_MAX) {
        cardLimitError();
        return;
      }

      setCardDetails(null);
      setIsTop(false);
      setIsShowCardDetailsModal(true);
    } else {
      const card = cards.find(x => x.id === cardId);
      if (card) {
        setIsShowCardDetailsModal(true);
        setCardDetails(card);
        setIsTop(card.isTop);
      }
    }
  };

  return (
    <>
      <div className="main-content left-menu-active  fixed-top-horizontal-scroll">
        <div className="page-notification pt-0 pb-0">
          <div className="container-fluid">
            <CardsFilter
              cardTypeFilter={cardTypeFilter}
              setCardTypeFilter={setCardTypeFilter}
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
            />
            <CardsForm
              cards={cards}
              groups={groups}
              cardDetails={cardDetails}
              modelName={modelName}
              isApiProcessing={isApiProcessing}
              isTop={isTop}
              setIsTop={setIsTop}
              cardLimitError={cardLimitError}
              isShowCardDetailsModal={isShowCardDetailsModal}
              hideCardFormModal={() => setIsShowCardDetailsModal(false)}
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
