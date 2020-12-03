import classNames from 'classnames';
import ConfidenceLevel from 'webserver-form-schema/constants/face-recognition-confidence-level';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {useFormikContext, Form, Field} from 'formik';
import CustomNotifyModal from '../../../core/components/custom-notify-modal';
import CustomTooltip from '../../../core/components/tooltip';
import i18n from '../../../i18n';
import {useContextState} from '../../stateProvider';

const FaceRecognitionSettings = ({setIsShowDetectionZone, isShowDetectionZone}) => {
  const {values, setFieldValue} = useFormikContext();
  const {isApiProcessing} = useContextState();
  const [isShowModal, setIsShowModal] = useState(false);
  const hideModal = () => setIsShowModal(false);
  return (
    <div className="col-5 pl-4 pr-0">
      <div className="card shadow">
        <div className="card-header">{i18n.t('Facial Recognition')}</div>
        <Form className="card-body">
          <div className="form-group d-flex justify-content-between align-items-center">
            <label className="mb-0">{i18n.t('Enable Facial Recognition')}</label>
            <div className="custom-control custom-switch">
              <Field
                name="isEnable"
                type="checkbox"
                className="custom-control-input"
                id="switch-face-recognition"
              />
              <label className="custom-control-label" htmlFor="switch-face-recognition">
                <span>{i18n.t('common.button.on')}</span>
                <span>{i18n.t('common.button.off')}</span>
              </label>
            </div>
          </div>
          <div className="form-group">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span>
                    <label className="mb-0 mr-2">{i18n.t('Enable Anti-Image Spoof')}</label>
                    <span className="badge badge-outline">Alpha</span>
                  </span>
                  <div className="custom-control custom-switch">
                    <CustomTooltip show={!values.isEnable} title={i18n.t('Facial Recognition is disabled.')}>
                      <span style={values.isEnable ? {} : {cursor: 'not-allowed'}}>
                        <Field
                          name="isEnableSpoofing"
                          type="checkbox"
                          disabled={!values.isEnable}
                          style={values.isEnable ? {} : {pointerEvents: 'none'}}
                          className="custom-control-input"
                          id="switch-face-recognition-spoofing"
                          onClick={() => values.isEnableSpoofing || setIsShowModal(true)}
                        />
                        <label className="custom-control-label" htmlFor="switch-face-recognition-spoofing">
                          <span>{i18n.t('common.button.on')}</span>
                          <span>{i18n.t('common.button.off')}</span>
                        </label>
                      </span>
                    </CustomTooltip>
                    <CustomNotifyModal
                      isShowModal={isShowModal}
                      modalTitle={i18n.t('Enable Anti-Image Spoof')}
                      modalBody={i18n.t('analytic.face-recognition.modal.spoofing')}
                      onHide={() => {
                        hideModal();
                        setFieldValue('isEnableSpoofing', false);
                      }}
                      onConfirm={hideModal}
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <label className="mb-0">{i18n.t('Level of Accuracy')}</label>
                  <CustomTooltip show={!values.isEnable} title={i18n.t('Facial Recognition is disabled.')}>
                    <div className="btn-group" style={values.isEnable ? {} : {cursor: 'not-allowed'}}>
                      {ConfidenceLevel.all().map(confidenceLevel => (
                        <button
                          key={confidenceLevel}
                          type="button"
                          className={classNames(
                            'btn triple-wrapper btn-sm outline-success px-2 py-1',
                            {active: values.confidenceLevel === confidenceLevel}
                          )}
                          disabled={!values.isEnable}
                          style={values.isEnable ? {} : {pointerEvents: 'none'}}
                          onClick={() => setFieldValue('confidenceLevel', confidenceLevel)}
                        >
                          {i18n.t(`confidence-level-${confidenceLevel}`)}
                        </button>
                      ))}
                    </div>
                  </CustomTooltip>
                </div>
              </div>
            </div>
          </div>

          <hr/>

          <div className="form-group">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <label className="mb-0 mr-2">{i18n.t('Detection Zone')}</label>
                <CustomTooltip title={i18n.t('The default is the whole live view screen.')}>
                  <i className="fas fa-question-circle helper-text text-primary"/>
                </CustomTooltip>
              </div>
              <CustomTooltip title={i18n.t('Show/Hide Detection Zone')}>
                <div className="custom-control custom-switch">
                  <a
                    className="form-control-feedback text-muted"
                    tabIndex={-1}
                    onClick={() => setIsShowDetectionZone(prevState => (!prevState))}
                  >
                    <i className={classNames('fas', isShowDetectionZone ? 'fa-eye' : 'fa-eye-slash')}/>
                  </a>
                </div>
              </CustomTooltip>
            </div>
          </div>
          <div className="form-group d-flex justify-content-between align-items-center">
            <label className="mb-0">{i18n.t('Enable Facial Detection Size')}</label>
            <div className="custom-control custom-switch">
              <Field
                name="isEnableFaceFrame"
                type="checkbox"
                className="custom-control-input"
                id="switch-face-size"
              />
              <label className="custom-control-label" htmlFor="switch-face-size">
                <span>{i18n.t('common.button.on')}</span>
                <span>{i18n.t('common.button.off')}</span>
              </label>
            </div>
          </div>

          <hr/>

          <div className="form-group">
            <label className="mb-3">{i18n.t('Live View Display')}</label>
            <div className="form-check mb-3">
              <Field
                name="isShowMember"
                className="form-check-input"
                type="checkbox"
                id="input-show-all"
              />
              <label className="form-check-label" htmlFor="input-show-all">{i18n.t('Display Name')}</label>
            </div>
            <div className="form-check mb-3">
              <Field
                name="isShowGroup"
                className="form-check-input"
                type="checkbox"
                id="input-show-register-group"
              />
              <label className="form-check-label" htmlFor="input-show-register-group">{i18n.t('Display Group')}</label>
            </div>
            <div className="form-check mb-3">
              <Field
                name="isShowUnknown"
                className="form-check-input"
                type="checkbox"
                id="input-show-unknown-personal"
              />
              <label className="form-check-label" htmlFor="input-show-unknown-personal">{i18n.t('Display Unknown')}</label>
            </div>
            <div className="form-check">
              <Field
                name="isShowFake"
                className="form-check-input"
                type="checkbox"
                id="input-show-fake"
              />
              <label className="form-check-label" htmlFor="input-show-fake">{i18n.t('Display Image Spoof')}</label>
            </div>
          </div>

          <button disabled={isApiProcessing} type="submit" className="btn btn-block btn-primary rounded-pill mt-5">
            {i18n.t('common.button.apply')}
          </button>
        </Form>
      </div>
    </div>
  );
};

FaceRecognitionSettings.propTypes = {
  isShowDetectionZone: PropTypes.bool.isRequired,
  setIsShowDetectionZone: PropTypes.func.isRequired
};

export default FaceRecognitionSettings;
