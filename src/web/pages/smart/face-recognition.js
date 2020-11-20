import {Formik} from 'formik';
import {getRouter} from 'capybara-router';
import progress from 'nprogress';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import api from '../../../core/apis/web-api';
import BreadCrumb from '../../../core/components/fields/breadcrumb';
import i18n from '../../../i18n';
import withGlobalStatus from '../../withGlobalStatus';
import FaceRecognitionSettings from './face-recognition-settings';
import FaceRecognitionStream from './face-recognition-stream';

const FaceRecognition = ({faceRecognitionSettings}) => {
  const [isShowDetectionZone, setIsShowDetectionZone] = useState(true);

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
            <>
              <FaceRecognitionStream
                isShowDetectionZone={isShowDetectionZone}
              />
              <FaceRecognitionSettings
                isShowDetectionZone={isShowDetectionZone}
                setIsShowDetectionZone={setIsShowDetectionZone}
              />
            </>
          </Formik>
        </div>
      </div>
    </div>
  );
};

FaceRecognition.propTypes = {
  faceRecognitionSettings: PropTypes.shape({
    confidenceLevel: PropTypes.string.isRequired,
    isEnable: PropTypes.bool.isRequired,
    isEnableSpoofing: PropTypes.bool.isRequired,
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
