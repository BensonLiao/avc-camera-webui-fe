import React, {useRef} from 'react';
import {useFormikContext, Field} from 'formik';
import i18n from '../../../i18n';
import MaskArea from '../../../core/components/fields/mask-area';
import PropTypes from 'prop-types';

const MotionDetectionMask = ({maskAreaStates, setMaskAreaStates}) => {
  const videoWrapperRef = useRef(null);
  const maskAreaRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const maskAreaItems = [0, 1, 2, 3];
  const {initialValues, values, resetForm, setFieldValue} = useFormikContext();

  const generateDeleteMaskAreaHandler = index => event => {
    // Delete if backspace or delete key is detected
    if (event.keyCode === 8 || event.keyCode === 46) {
      setMaskAreaStates(prevState => {
        const maskAreaState = [...prevState];
        maskAreaState[index].isVisible = false;
        return maskAreaState;
      });
    }
  };

  const generateVideoWrapperMouseDownHandler = event => {
    const width = videoWrapperRef.current.offsetWidth;
    const height = videoWrapperRef.current.offsetHeight;
    const rect = videoWrapperRef.current.getBoundingClientRect();
    const position = {
      x: Math.round((event.clientX - rect.left) / width * 100),
      y: Math.round((event.clientY - rect.top) / height * 100),
      width: 1,
      height: 1
    };
    const maskAreas = [...initialValues.areas];
    const mouseDownEvent = {...event};

    for (let index = 0; index < maskAreaStates.length; index += 1) {
      if (!maskAreaStates[index].isVisible) {
        maskAreaStates[index].isVisible = true;
        maskAreas[index] = position;
        resetForm({
          values: {
            ...initialValues,
            isEnable: values.isEnable,
            areas: maskAreas
          }
        });
        setMaskAreaStates(maskAreaStates);

        setTimeout(() => {
          for (let maskAreaIndex = 0; maskAreaIndex < maskAreaStates.length; maskAreaIndex += 1) {
            // Recover other areas.
            if (maskAreaIndex !== index) {
              setFieldValue(`areas.${maskAreaIndex}`, values.areas[maskAreaIndex]);
            }
          }

          maskAreaRefs[index].current.dispatchEvent(
            new MouseEvent('mousedown', mouseDownEvent)
          );
        });
        return;
      }
    }
  };

  return (
    <div className="col-7 pl-3 pr-0">
      <div ref={videoWrapperRef} id="md-video-wrapper" className="video-wrapper">
        <img
          className="img-fluid"
          draggable={false}
          src="/api/snapshot"
          onMouseDown={generateVideoWrapperMouseDownHandler}
        />
        {
          maskAreaItems.map(index => (
            maskAreaStates[index].isVisible ? (
              <div key={index} className="draggable-wrapper" tabIndex={-1} onKeyDown={generateDeleteMaskAreaHandler(index)}>
                <Field
                  rightBottomCornerRef={maskAreaRefs[index]}
                  name={`areas.${index}`}
                  component={MaskArea}
                  text={i18n.t('analytics.md.detectionZone')}
                  className="bounding-primary"
                  parentElementId="md-video-wrapper"
                />
              </div>
            ) :
              <div key={index}/>
          ))
        }
      </div>
    </div>
  );
};

MotionDetectionMask.propTypes = {
  maskAreaStates: PropTypes.array.isRequired,
  setMaskAreaStates: PropTypes.func.isRequired
};

export default MotionDetectionMask;
