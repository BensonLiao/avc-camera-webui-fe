import {getRouter} from 'capybara-router';
import progress from 'nprogress';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import api from '../../../core/apis/web-api';
import CustomNotifyModal from '../../../core/components/custom-notify-modal';
import CustomTooltip from '../../../core/components/tooltip';
import FormikEffect from '../../../core/components/formik-effect';
import i18n from '../../../i18n';
import {useContextState} from '../../stateProvider';

const SDCardOperation = ({sdEnabled, sdStatus}) => {
  const {isApiProcessing} = useContextState();

  const [state, setState] = useState({
    showSelectModal: {
      isShowFormatModal: false,
      isShowUnmountModal: false,
      isShowDisableModal: false
    }
  });

  const {showSelectModal: {isShowFormatModal, isShowUnmountModal, isShowDisableModal}} = state;

  const showModal = selectedModal => event => {
    event.preventDefault();
    return setState(prevState => ({
      ...prevState,
      showSelectModal: {
        ...prevState.showSelectModal,
        [selectedModal]: true
      }
    }));
  };

  const callApi = (apiFunction, value = '') => {
    progress.start();
    api.system[apiFunction](value)
      .then(getRouter().reload)
      .finally(progress.done);
  };

  const onChangeSdCardSetting = ({nextValues, prevValues}) => {
    if (prevValues.sdEnabled && !nextValues.sdEnabled) {
      return setState(prevState => ({
        ...prevState,
        showSelectModal: {
          ...prevState.showSelectModal,
          isShowDisableModal: true
        }
      }));
    }

    if (!prevValues.sdEnabled && nextValues.sdEnabled) {
      return callApi('enableSD', {sdEnabled: nextValues.sdEnabled});
    }

    if (`${prevValues.sdAlertEnabled}` !== `${nextValues.sdAlertEnabled}`) {
      return callApi('sdCardAlert', {sdAlertEnabled: nextValues.sdAlertEnabled});
    }
  };

  const sdcardModalRender = mode => {
    const modalType = {
      format: {
        showModal: isShowFormatModal,
        modalOnSubmit: () => callApi('formatSDCard'),
        modalTitle: i18n.t('Format'),
        modalBody: i18n.t('Are you sure you want to format the Micro SD card?')
      },
      unmount: {
        showModal: isShowUnmountModal,
        modalOnSubmit: () => callApi('unmountSDCard'),
        modalTitle: i18n.t('Unmount'),
        modalBody: i18n.t('Are you sure you want to unmount the Micro SD card?')
      },
      disable: {
        showModal: isShowDisableModal,
        modalOnSubmit: () => callApi('enableSD', {sdEnabled: false}),
        modalTitle: i18n.t('Disabling SD Card'),
        modalBody: [i18n.t('Event photos will not be available after the SD card is disabled. Are you sure you want to continue?')]
      }
    };
    return (
      <CustomNotifyModal
        isShowModal={modalType[mode].showModal}
        modalTitle={modalType[mode].modalTitle}
        modalBody={modalType[mode].modalBody}
        isConfirmDisable={isApiProcessing}
        onHide={getRouter().reload} // Reload to reset SD card switch button state
        onConfirm={modalType[mode].modalOnSubmit}
      />
    );
  };

  return (
    <div className="form-group">
      <FormikEffect onChange={onChangeSdCardSetting}/>
      <div className="card">
        <div className="card-body">
          <label>{i18n.t('Operation')}</label>
          <div>
            <CustomTooltip show={sdEnabled} title={i18n.t('Please disable the SD card first.')}>
              <span style={sdEnabled || sdStatus ? {cursor: 'not-allowed'} : {}}>
                <button
                  className="btn btn-outline-primary rounded-pill px-5 mr-3"
                  type="button"
                  disabled={sdEnabled || sdStatus}
                  style={sdEnabled || sdStatus ? {pointerEvents: 'none'} : {}}
                  onClick={showModal('isShowFormatModal')}
                >
                  {i18n.t('Format')}
                </button>
                {sdcardModalRender('format')}
              </span>
            </CustomTooltip>
            <CustomTooltip show={sdEnabled} title={i18n.t('Please disable the SD card first.')}>
              <span style={sdEnabled ? {cursor: 'not-allowed'} : {}}>
                <button
                  className="btn btn-outline-primary rounded-pill px-5"
                  type="button"
                  disabled={sdEnabled || isApiProcessing}
                  style={sdEnabled ? {pointerEvents: 'none'} : {}}
                  onClick={sdStatus ? () => (callApi('mountSDCard')) : showModal('isShowUnmountModal')}
                >
                  {sdStatus ? i18n.t('Mount') : i18n.t('Unmount')}
                </button>
                {sdcardModalRender('unmount')}
              </span>
            </CustomTooltip>
            <span>
              {sdcardModalRender('disable')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

SDCardOperation.propTypes = {
  // eslint-disable-next-line react/boolean-prop-naming
  sdEnabled: PropTypes.bool.isRequired,
  sdStatus: PropTypes.number.isRequired
};

export default SDCardOperation;
