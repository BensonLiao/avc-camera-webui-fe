import React from 'react';
import PropTypes from 'prop-types';
import {connectForm} from '../../../core/components/form-connect';
import DrawingCanvas from '../../../core/components/fields/drawing-canvas';
import {HUMAN_DETECTION_TYPE} from '../../../core/constants';

const HumanDetectionTrigger = connectForm(({
  formik,
  triggerType,
  currentAreaId,
  setCurrentAreaId,
  currentLineId,
  setCurrentLineId
}) => {
  const {values, setValues} = formik;
  return (
    <DrawingCanvas
      values={values}
      setValues={setValues}
      triggerType={triggerType}
      currentAreaId={currentAreaId}
      setCurrentAreaId={setCurrentAreaId}
      currentLineId={currentLineId}
      setCurrentLineId={setCurrentLineId}
    />
  );
});

HumanDetectionTrigger.propTypes = {triggerType: PropTypes.oneOf(Object.values(HUMAN_DETECTION_TYPE))};

export default HumanDetectionTrigger;
