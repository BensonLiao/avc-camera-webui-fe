import classNames from 'classnames';
import {getRouter, Link} from '@benson.liao/capybara-router';
import {Field, ErrorMessage} from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import {Tab} from 'react-bootstrap';
import CustomTooltip from '../../../core/components/tooltip';
import i18n from '../../../i18n';
import {connectForm} from '../../../core/components/form-connect';
import {useContextState} from '../../stateProvider';
import {useConfirm} from '../../../core/components/confirm';

const SDCardOperation = connectForm(({
  sdEnabled, sdStatus, callApi, isEnableAuth, isWaitingApiCall, onSubmit, snapshotMaxNumber,
  formik: {errors, touched, values: formValues}
}) => {
  const confirm = useConfirm();
  const {isApiProcessing} = useContextState();
  /**
   * Check for empty value, validation considers empty string to be 0 due to automatic convertion, convert=true
   * @param {number} value - Value of the form field 'sdRecordingType'
   * @returns {string} Validation string
   */
  const emptyStringCheck = value => {
    if (value === '') {
      return i18n.t('validation.stringEmpty');
    }
  };

  const confirmAction = type => _ => {
    let confirmBody;
    let confirmTitle;
    switch (type) {
      case ('unmountSDCard'):
        confirmTitle = i18n.t('sdCard.basic.unmount');
        confirmBody = i18n.t('sdCard.modal.disabledUnmountButton');
        break;
      case ('formatSDCard'):
        confirmTitle = i18n.t('sdCard.basic.format');
        confirmBody = i18n.t('sdCard.modal.disabledFormatButton');
        break;
      default: break;
    }

    confirm.open({
      title: confirmTitle,
      body: confirmBody
    })
      .then(isConfirm => {
        if (isConfirm) {
          return callApi(type);
        }

        return getRouter().reload();
      });
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
                    disabled={sdEnabled || isApiProcessing || isWaitingApiCall}
                    style={sdEnabled ? {pointerEvents: 'none'} : {}}
                    onClick={confirmAction('formatSDCard')}
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
                    disabled={sdEnabled || isApiProcessing || isWaitingApiCall}
                    style={sdEnabled ? {pointerEvents: 'none'} : {}}
                    onClick={sdStatus ? () => (callApi('mountSDCard')) : confirmAction('unmountSDCard')}
                  >
                    {sdStatus ? i18n.t('sdCard.basic.mount') : i18n.t('sdCard.basic.unmount')}
                  </button>
                </span>
              </CustomTooltip>
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
                      disabled={!isEnableAuth || isWaitingApiCall || isApiProcessing}
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
        <CustomTooltip show={!sdEnabled} title={i18n.t('sdCard.basic.enable')}>
          <div className="form-group">
            <label>{i18n.t('sdCard.basic.snapshotAmount')}</label>
            <Field
              disabled={formValues.sdEnabled === false || isWaitingApiCall}
              name="snapshotMaxNumber"
              type="number"
              validate={emptyStringCheck}
              placeholder="12000"
              className={classNames('form-control', {'is-invalid': errors.snapshotMaxNumber && touched.snapshotMaxNumber})}
            />
            <ErrorMessage component="div" name="snapshotMaxNumber" className="invalid-feedback"/>
            <p className="text-size-14 text-muted mt-2">{i18n.t('sdCard.basic.snapshotRange')}</p>
          </div>
        </CustomTooltip>
        <div
          className="horizontal-border"
          style={{
            width: 'calc(100% + 3rem)',
            marginLeft: '-1.5rem'
          }}
        />
        <div className="d-flex mt-32px">
          <button
            className="btn btn-primary rounded-pill ml-auto px-40px"
            disabled={snapshotMaxNumber === formValues.snapshotMaxNumber || errors.snapshotMaxNumber || isApiProcessing}
            type="button"
            onClick={() => onSubmit(formValues.snapshotMaxNumber)}
          >
            {i18n.t('common.button.apply')}
          </button>
        </div>
      </Tab.Pane>
    </Tab.Content>
  );
});

SDCardOperation.propTypes = {
  sdEnabled: PropTypes.bool.isRequired,
  sdStatus: PropTypes.number.isRequired,
  callApi: PropTypes.func.isRequired,
  isEnableAuth: PropTypes.bool.isRequired,
  isWaitingApiCall: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default SDCardOperation;
