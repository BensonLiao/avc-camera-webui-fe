/* eslint-disable react/prop-types */
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {getRouter} from 'capybara-router';
import {Formik, Form, Field} from 'formik';
import progress from 'nprogress';
import ConfidenceLevel from 'webserver-form-schema/constants/face-recognition-confidence-level';
import MaskArea from '../../../core/components/fields/mask-area';
import api from '../../../core/apis/web-api';
import i18n from '../../../i18n';
import CustomNotifyModal from '../../../core/components/custom-notify-modal';
import CustomTooltip from '../../../core/components/tooltip';
import BreadCrumb from '../../../core/components/fields/breadcrumb';
import withGlobalStatus from '../../withGlobalStatus';
import {useContextState} from '../../stateProvider';

const FaceRecognition = ({faceRecognitionSettings}) => {
  const {isApiProcessing} = useContextState();

  const [state, setState] = useState({
    // Show or hide trigger area
    isShowDetectionZone: true,
    isShowModal: false
  });

  const {isShowDetectionZone, isShowModal} = state;

  const onToggleDetectionZone = () => {
    setState(prevState => ({
      ...prevState,
      isShowDetectionZone: !prevState.isShowDetectionZone
    }));
  };

  const onSubmitFaceRecognitionSettingsForm = (values, faceRecognitionSettings) => {
    progress.start();

    const createPromises = () => {
      let promises = [];

      if (values.isEnable !== faceRecognitionSettings.isEnable) {
        promises.push(api.smartFunction.updateFRSetting(values));
      }

      if (values.isEnableSpoofing !== faceRecognitionSettings.isEnableSpoofing) {
        promises.push(api.smartFunction.updateFRSpoofing(values));
      }

      if (values.confidenceLevel !== faceRecognitionSettings.confidenceLevel) {
        promises.push(api.smartFunction.updateFRConfidenceLevel(values));
      }

      if (
        values.isShowMember !== faceRecognitionSettings.isShowMember ||
        values.isShowGroup !== faceRecognitionSettings.isShowGroup ||
        values.isShowUnknown !== faceRecognitionSettings.isShowUnknown ||
        values.isShowFake !== faceRecognitionSettings.isShowFake
      ) {
        promises.push(api.smartFunction.updateFREnrollDisplaySetting({
          ...values,
          isShowMember: values.isShowMember,
          isShowGroup: values.isShowGroup,
          isShowUnknown: values.isShowUnknown,
          isShowFake: values.isShowFake
        }));
      }

      if (
        values.triggerArea !== faceRecognitionSettings.triggerArea ||
        values.isEnableFaceFrame !== faceRecognitionSettings.isEnableFaceFrame ||
        values.faceFrame !== faceRecognitionSettings.faceFrame
      ) {
        promises.push(api.smartFunction.updateFRROI({
          ...values,
          triggerArea: values.triggerArea
        }));
      }

      return promises;
    };

    Promise.all(createPromises())
      .then(getRouter().reload)
      .finally(progress.done);
  };

  const hideModal = () => {
    setState(prevState => ({
      ...prevState,
      isShowModal: false
    }));
  };

  const confirmEnableSpoof = isEnableSpoofing => {
    if (!isEnableSpoofing) {
      setState(prevState => ({
        ...prevState,
        isShowModal: true
      }));
    }
  };

  return (
    <div className="page-smart">
      <div className="container-fluid">
        <div className="row">
          <BreadCrumb
            path={[i18n.t('Analytics Settings'), i18n.t('Facial Recognition')]}
            routes={['/analytic/face-recognition']}
          />
          <Formik
            initialValues={faceRecognitionSettings}
            onSubmit={values => onSubmitFaceRecognitionSettingsForm(values, faceRecognitionSettings)}
          >
            {({values, setFieldValue}) => {
              return (
                <>
                  <div className="col-7 pl-3 pr-0">
                    <div id="fr-video-wrapper" className="video-wrapper">
                      <img className="img-fluid" draggable={false} src="/api/snapshot"/>
                      {
                        isShowDetectionZone && (
                          <div className="draggable-wrapper" tabIndex={-1}>
                            <Field
                              name="triggerArea"
                              component={MaskArea}
                              text={i18n.t('Detection Zone')}
                              className="bounding-black"
                              parentElementId="fr-video-wrapper"
                            />
                          </div>
                        )
                      }
                      {
                        values.isEnableFaceFrame && (
                          <div className="draggable-wrapper" tabIndex={-1}>
                            <Field
                              name="faceFrame"
                              component={MaskArea}
                              text={i18n.t('Min. Facial Detection Size')}
                              className="bounding-primary"
                              parentElementId="fr-video-wrapper"
                            />
                          </div>
                        )
                      }
                    </div>
                  </div>
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
                              checked={values.isEnable}
                              className="custom-control-input"
                              id="switch-face-recognition"
                            />
                            <label className="custom-control-label" htmlFor="switch-face-recognition">
                              <span>{i18n.t('ON')}</span>
                              <span>{i18n.t('OFF')}</span>
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
                                        checked={values.isEnableSpoofing}
                                        disabled={!values.isEnable}
                                        style={values.isEnable ? {} : {pointerEvents: 'none'}}
                                        className="custom-control-input"
                                        id="switch-face-recognition-spoofing"
                                        onClick={() => confirmEnableSpoof(values.isEnableSpoofing)}
                                      />
                                      <label className="custom-control-label" htmlFor="switch-face-recognition-spoofing">
                                        <span>{i18n.t('ON')}</span>
                                        <span>{i18n.t('OFF')}</span>
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
                                  onClick={onToggleDetectionZone}
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
                              checked={values.isEnableFaceFrame}
                              className="custom-control-input"
                              id="switch-face-size"
                            />
                            <label className="custom-control-label" htmlFor="switch-face-size">
                              <span>{i18n.t('ON')}</span>
                              <span>{i18n.t('OFF')}</span>
                            </label>
                          </div>
                        </div>

                        <hr/>

                        <div className="form-group">
                          <label className="mb-3">{i18n.t('Live View Display')}</label>
                          <div className="form-check mb-3">
                            <Field
                              name="isShowMember"
                              checked={values.isShowMember}
                              className="form-check-input"
                              type="checkbox"
                              id="input-show-all"
                            />
                            <label className="form-check-label" htmlFor="input-show-all">{i18n.t('Display Name')}</label>
                          </div>
                          <div className="form-check mb-3">
                            <Field
                              name="isShowGroup"
                              checked={values.isShowGroup}
                              className="form-check-input"
                              type="checkbox"
                              id="input-show-register-group"
                            />
                            <label className="form-check-label" htmlFor="input-show-register-group">{i18n.t('Display Group')}</label>
                          </div>
                          <div className="form-check mb-3">
                            <Field
                              name="isShowUnknown"
                              checked={values.isShowUnknown}
                              className="form-check-input"
                              type="checkbox"
                              id="input-show-unknown-personal"
                            />
                            <label className="form-check-label" htmlFor="input-show-unknown-personal">{i18n.t('Display Unknown')}</label>
                          </div>
                          <div className="form-check">
                            <Field
                              name="isShowFake"
                              checked={values.isShowFake}
                              className="form-check-input"
                              type="checkbox"
                              id="input-show-fake"
                            />
                            <label className="form-check-label" htmlFor="input-show-fake">{i18n.t('Display Image Spoof')}</label>
                          </div>
                        </div>

                        <button disabled={isApiProcessing} type="submit" className="btn btn-block btn-primary rounded-pill mt-5">
                          {i18n.t('Apply')}
                        </button>
                      </Form>
                    </div>
                  </div>
                </>
              );
            }}
          </Formik>
        </div>
      </div>
    </div>
  );
};

FaceRecognition.propTypes = {
  faceRecognitionSettings: PropTypes.shape({
    isEnable: PropTypes.bool.isRequired,
    isShowMember: PropTypes.bool.isRequired,
    isShowGroup: PropTypes.bool.isRequired,
    isShowUnknown: PropTypes.bool.isRequired,
    isShowFake: PropTypes.bool.isRequired,
    triggerArea: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired
    }).isRequired,
    isEnableFaceFrame: PropTypes.bool.isRequired,
    faceFrame: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired
    }).isRequired
  }).isRequired
};

export default withGlobalStatus(FaceRecognition);
