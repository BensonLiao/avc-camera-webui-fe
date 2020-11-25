import PropTypes from 'prop-types';
import React, {useState} from 'react';
import CustomTooltip from '../../../core/components/tooltip';
import i18n from '../../../i18n';
import {useContextState} from '../../stateProvider';

const SDCardOperation = ({sdEnabled, sdStatus, callApi, sdcardModalRender}) => {
  const {isApiProcessing} = useContextState();
  const [isShowConfirmModal, setIsShowConfirmModal] = useState({
    isShowFormatModal: false,
    isShowUnmountModal: false
  });
  const {isShowFormatModal, isShowUnmountModal} = isShowConfirmModal;

  const showModal = selectedModal => event => {
    event.preventDefault();
    return setIsShowConfirmModal(prevState => ({
      ...prevState,
      [selectedModal]: true
    }));
  };

  return (
    <div className="form-group">
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
              </span>
            </CustomTooltip>
            {sdcardModalRender({
              showModal: isShowFormatModal,
              modalOnSubmit: {api: 'formatSDCard'},
              modalTitle: i18n.t('Format'),
              modalBody: i18n.t('Are you sure you want to format the Micro SD card?')
            })}
            {sdcardModalRender({
              showModal: isShowUnmountModal,
              modalOnSubmit: {api: 'unmountSDCard'},
              modalTitle: i18n.t('Unmount'),
              modalBody: i18n.t('Are you sure you want to unmount the Micro SD card?')
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

SDCardOperation.propTypes = {
  // eslint-disable-next-line react/boolean-prop-naming
  sdEnabled: PropTypes.bool.isRequired,
  sdStatus: PropTypes.number.isRequired,
  callApi: PropTypes.func.isRequired,
  sdcardModalRender: PropTypes.func.isRequired
};

export default SDCardOperation;
