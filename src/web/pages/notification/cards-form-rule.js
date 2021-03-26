import classNames from 'classnames';
import {Field, ErrorMessage} from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import NotificationCardType from 'webserver-form-schema/constants/notification-card-type';
import NotificationFaceRecognitionCondition from 'webserver-form-schema/constants/notification-face-recognition-condition';
import NotificationHdOption from 'webserver-form-schema/constants/notification-hd-option';
import i18n from '../../../i18n';
import i18nUtils from '../../../i18n/utils';
import ErrorDisplay from '../../../core/components/error-display';

const CardsFormRule = ({
  groups,
  values: {
    faceRecognitionCondition,
    isEnableFaceRecognition,
    type,
    hdEnabled,
    hdOption
  },
  setFieldValue,
  triggerArea,
  errors,
  touched
}) => {
  const setHdOption = option => setFieldValue('hdOption', option);
  return (
    <>
      {
        type === NotificationCardType.faceRecognition && (
          <>
            <div className="form-group d-flex justify-content-between align-items-center">
              <label className="mb-0">{i18n.t('notification.cards.enableNotifyResult')}</label>
              <div className="custom-control custom-switch">
                <Field
                  name="isEnableFaceRecognition"
                  checked={isEnableFaceRecognition}
                  type="checkbox"
                  className="custom-control-input"
                  id="switch-notification-face-recognition"
                />
                <label className="custom-control-label" htmlFor="switch-notification-face-recognition">
                  <span>{i18n.t('common.button.on')}</span>
                  <span>{i18n.t('common.button.off')}</span>
                </label>
              </div>
            </div>
            <div className="form-group">
              {
                NotificationFaceRecognitionCondition.all().map(condition => (
                  <div key={condition} className="form-check mb-3">
                    <Field
                      name="faceRecognitionCondition"
                      className="form-check-input"
                      type="radio"
                      id={`input-notification-face-recognition-${condition}`}
                      value={condition}
                    />
                    <label className="form-check-label" htmlFor={`input-notification-face-recognition-${condition}`}>
                      {i18nUtils.getNotificationFRConditionI18N(condition, <ErrorDisplay/>)}
                    </label>
                  </div>
                ))
              }
            </div>
            { faceRecognitionCondition === NotificationFaceRecognitionCondition.success && (
              <div className="form-group">
                <div className="card">
                  <div className="card-body px-4 py-4">
                    <div className="form-group">
                      <label className="text-size-16 mb-0">{i18n.t('notification.cards.group')}</label>
                    </div>
                    <div className="col-auto px-0">
                      <div className="select-wrapper border rounded-pill overflow-hidden d-flex align-items-center">
                        <i className="far fa-folder fa-sm"/>
                        <Field name="$groups" component="select" className="form-control border-0">
                          <option value="">{i18n.t('notification.cards.everyone')}</option>
                          {
                            groups.items.map(group => (
                              <option key={group.id} value={group.id}>{group.name}</option>
                            ))
                          }
                        </Field>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )
      }
      {
        type === NotificationCardType.humanoidDetection && (
          <>
            <div className="form-group d-flex justify-content-between align-items-center">
              <label className="mb-0">{i18n.t('notification.cards.enableHD')}</label>
              <div className="custom-control custom-switch">
                <Field
                  name="hdEnabled"
                  checked={hdEnabled}
                  type="checkbox"
                  className="custom-control-input"
                  id="switch-notification-humanoid-detection"
                />
                <label className="custom-control-label" htmlFor="switch-notification-humanoid-detection">
                  <span>{i18n.t('common.button.on')}</span>
                  <span>{i18n.t('common.button.off')}</span>
                </label>
              </div>
            </div>
            <div className="form-group d-flex justify-content-between align-items-center">
              <label className="mb-0">{i18n.t('notification.cards.hdOption')}</label>
              <div>
                <button
                  className={`btn ${hdOption === NotificationHdOption.capacity ? 'btn-primary' : 'btn-outline-primary'}`}
                  type="button"
                  onClick={() => setHdOption(NotificationHdOption.capacity)}
                >
                  {i18n.t('notification.cards.capactiy')}
                </button>
                <button
                  className={`btn ml-3 ${hdOption === NotificationHdOption.intrusion ? 'btn-primary' : 'btn-outline-primary'}`}
                  type="button"
                  onClick={() => setHdOption(NotificationHdOption.intrusion)}
                >
                  {i18n.t('notification.cards.intrusion')}
                </button>
              </div>
            </div>
            {
              hdOption === NotificationHdOption.capacity ? (
                <div className="form-group">
                  <label>{i18n.t('notification.cards.capacityCount')}</label>
                  <Field
                    name="hdCapacity"
                    type="number"
                    className={classNames('form-control', {'is-invalid': errors.hdCapacity && touched.hdCapacity})}
                  />
                  <ErrorMessage component="div" name="hdCapacity" className="invalid-feedback"/>
                </div>
              ) : (
                <div className="form-group">
                  <label>{i18n.t('notification.cards.intrusionArea')}</label>
                  {
                    triggerArea.map(area => (
                      <React.Fragment key={area.name}>
                        <div className="d-flex align-items-center">
                          <div className="form-check m-2">
                            <Field
                              name="hdIntrusionAreaId"
                              className="form-check-input"
                              type="radio"
                              id={`hd-intrusion-area-${area.name}`}
                              value={`${area.id}`}
                            />
                            <label
                              className="form-check-label pl-2"
                              htmlFor={`hd-intrusion-area-${area.name}`}
                            >
                              {area.name}
                            </label>
                          </div>
                        </div>
                      </React.Fragment>
                    ))
                  }
                </div>
              )
            }
          </>
        )
      }
    </>
  );
};

CardsFormRule.propTypes = {
  values: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  touched: PropTypes.object.isRequired,
  groups: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      note: PropTypes.string.isRequired
    }).isRequired)
  }).isRequired,
  setFieldValue: PropTypes.func.isRequired,
  triggerArea: PropTypes.array.isRequired
};

export default CardsFormRule;
