import {Field} from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import NotificationFaceRecognitionCondition from 'webserver-form-schema/constants/notification-face-recognition-condition';
import i18n from '../../../i18n';

const CardsFormRule = ({faceRecognitionCondition, isEnableFaceRecognition, groups}) => {
  return (
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
                {i18n.t(`notification.cards.constants.face-recognition-condition-${condition}`)}
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
  );
};

CardsFormRule.propTypes = {
  faceRecognitionCondition: PropTypes.string.isRequired,
  isEnableFaceRecognition: PropTypes.bool.isRequired,
  groups: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      note: PropTypes.string.isRequired
    }).isRequired)
  }).isRequired
};

export default CardsFormRule;
