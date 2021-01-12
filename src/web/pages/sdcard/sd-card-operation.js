import {getRouter, Link} from '@benson.liao/capybara-router';
import {Field} from 'formik';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {Tab} from 'react-bootstrap';
import CustomNotifyModal from '../../../core/components/custom-notify-modal';
import CustomTooltip from '../../../core/components/tooltip';
import i18n from '../../../i18n';
import {useContextState} from '../../stateProvider';

const SDCardOperation = ({sdEnabled, sdStatus, callApi, isEnableAuth}) => {
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
    <Tab.Content>
      <Tab.Pane eventKey="tab-sdcard-operation">
        <div className="form-group">
          <label>{i18n.t('sdCard.basic.operation')}</label>
          <div className="card-body p-2">
            <div>
              <CustomTooltip show={sdEnabled} title={i18n.t('sdCard.tooltip.disabledOperationButton')}>
                <span style={sdEnabled ? {cursor: 'not-allowed'} : {}}>
                  <button
                    className="btn btn-outline-primary rounded-pill px-5 mr-3"
                    type="button"
                    disabled={sdEnabled}
                    style={sdEnabled ? {pointerEvents: 'none'} : {}}
                    onClick={showModal('isShowFormatModal')}
                  >
                    {i18n.t('sdCard.basic.format')}
                  </button>
                </span>
              </CustomTooltip>
              <CustomTooltip show={sdEnabled} title={i18n.t('sdCard.tooltip.disabledOperationButton')}>
                <span style={sdEnabled ? {cursor: 'not-allowed'} : {}}>
                  <button
                    className="btn btn-outline-primary rounded-pill px-5"
                    type="button"
                    disabled={sdEnabled || isApiProcessing}
                    style={sdEnabled ? {pointerEvents: 'none'} : {}}
                    onClick={sdStatus ? () => (callApi('mountSDCard')) : showModal('isShowUnmountModal')}
                  >
                    {sdStatus ? i18n.t('sdCard.basic.mount') : i18n.t('sdCard.basic.unmount')}
                  </button>
                </span>
              </CustomTooltip>
              <CustomNotifyModal
                isShowModal={isShowFormatModal}
                modalTitle={i18n.t('sdCard.basic.format')}
                modalBody={i18n.t('sdCard.modal.disabledFormatButton')}
                isConfirmDisable={isApiProcessing}
                onHide={getRouter().reload} // Reload to reset SD card switch button state
                onConfirm={() => callApi('formatSDCard')}
              />
              <CustomNotifyModal
                isShowModal={isShowUnmountModal}
                modalTitle={i18n.t('sdCard.basic.unmount')}
                modalBody={i18n.t('sdCard.modal.disabledUnmountButton')}
                isConfirmDisable={isApiProcessing}
                onHide={getRouter().reload} // Reload to reset SD card switch button state
                onConfirm={() => callApi('unmountSDCard')}
              />
            </div>
          </div>
        </div>
        <div className="form-group">
          <div className="row d-flex justify-content-between ml-0 mr-0 mb-1">
            <label>{i18n.t('sdCard.basic.errorNotification')}</label>
            <span>
              {
                isEnableAuth ?
                  <a className="text-success">{i18n.t('sdCard.basic.notificationSet')}</a> :
                  <Link className="text-danger" to="/notification/smtp">{i18n.t('sdCard.basic.enableOutgoingEmail')}</Link>
              }
            </span>
          </div>
          <div className="card">
            <div className="card-body">
              <div className="form-group align-items-center mb-0">
                <label className="mb-0 mr-3">{i18n.t('sdCard.basic.emailNotification')}</label>
                <CustomTooltip show={!isEnableAuth} title={i18n.t('sdCard.tooltip.disabledNotificationButton')}>
                  <div className="custom-control custom-switch float-right">
                    <Field
                      disabled={!isEnableAuth}
                      name="sdAlertEnabled"
                      type="checkbox"
                      style={isEnableAuth ? {} : {pointerEvents: 'none'}}
                      className="custom-control-input"
                      id="switch-output"
                    />
                    <label className="custom-control-label" htmlFor="switch-output">
                      <span>{i18n.t('common.button.on')}</span>
                      <span>{i18n.t('common.button.off')}</span>
                    </label>
                  </div>
                </CustomTooltip>
              </div>
            </div>
          </div>
        </div>
      </Tab.Pane>
    </Tab.Content>
  );
};

SDCardOperation.propTypes = {
  // eslint-disable-next-line react/boolean-prop-naming
  sdEnabled: PropTypes.bool.isRequired,
  sdStatus: PropTypes.number.isRequired,
  callApi: PropTypes.func.isRequired,
  isEnableAuth: PropTypes.bool.isRequired
};

export default SDCardOperation;
