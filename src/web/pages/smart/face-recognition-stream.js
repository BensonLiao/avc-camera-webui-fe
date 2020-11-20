import {useFormikContext, Field} from 'formik';
import React from 'react';
import i18n from '../../../i18n';
import MaskArea from '../../../core/components/fields/mask-area';
import PropTypes from 'prop-types';

const FaceRecognitionStream = ({isShowDetectionZone}) => {
  const {values} = useFormikContext();
  return (
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
  );
};

FaceRecognitionStream.propTypes = {isShowDetectionZone: PropTypes.bool.isRequired};

export default FaceRecognitionStream;
