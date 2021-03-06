import React from 'react';
import PropTypes from 'prop-types';
import {useFormikContext, Field} from 'formik';
import i18n from '../../../i18n';
import MaskArea from '../../../core/components/fields/mask-area';
import ImgWithFallback from '../../../core/components/img-with-fallback';

const FaceRecognitionMask = ({isShowDetectionZone}) => {
  const {values} = useFormikContext();
  return (
    <div className="col-7 pl-3 pr-0">
      <div id="fr-video-wrapper" className="video-wrapper">
        <ImgWithFallback
          className="img-fluid"
          draggable={false}
          src="/api/snapshot"
        />
        {
          isShowDetectionZone && (
            <div className="draggable-wrapper" tabIndex={-1}>
              <Field
                name="triggerArea"
                component={MaskArea}
                text={i18n.t('analytics.facialRecognition.detectionZone')}
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
                text={i18n.t('analytics.facialRecognition.minDetectionSize')}
                className="bounding-primary"
                parentElementId="fr-video-wrapper"
              />
            </div>
          )
        }
      </div>
    </div>
  );
};

FaceRecognitionMask.propTypes = {isShowDetectionZone: PropTypes.bool.isRequired};

export default FaceRecognitionMask;
