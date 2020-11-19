import {Formik, Form} from 'formik';
import {getRouter} from 'capybara-router';
import progress from 'nprogress';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import api from '../../../core/apis/web-api';
import BreadCrumb from '../../../core/components/fields/breadcrumb';
import i18n from '../../../i18n';
import withGlobalStatus from '../../withGlobalStatus';
import MotionDetectionStream from './motion-detection-stream';
import MotionDetectionSettings from './motion-detection-settings';

const MotionDetection = ({motionDetectionSettings, motionDetectionSettings: {areas, isEnable}}) => {
  const [maskAreaStates, setMaskAreaStates] = useState([
    {isVisible: Boolean(areas[0]) && isEnable},
    {isVisible: Boolean(areas[1]) && isEnable},
    {isVisible: Boolean(areas[2]) && isEnable},
    {isVisible: Boolean(areas[3]) && isEnable}
  ]);

  const generateInitialValues = settings => {
    return {...settings};
  };

  const onSubmitMotionDetectionSettingsForm = values => {
    progress.start();
    api.smartFunction.updateMotionDetectionSettings({
      isEnable: values.isEnable,
      sensibility: values.sensibility,
      areas: (() => {
        const result = [];

        maskAreaStates.forEach((state, index) => {
          if (state.isVisible) {
            result.push(values.areas[index]);
          }
        });
        return result;
      })()
    })
      .then(getRouter().reload)
      .finally(progress.done);
  };

  return (
    <div className="page-smart">
      <div className="container-fluid">
        <Formik
          initialValues={generateInitialValues(motionDetectionSettings)}
          onSubmit={onSubmitMotionDetectionSettingsForm}
        >
          <Form className="row">
            <BreadCrumb
              path={[i18n.t('Analytics Settings'), i18n.t('Motion Detection')]}
              routes={['/analytic/face-recognition']}
            />
            <MotionDetectionStream
              setMaskAreaStates={setMaskAreaStates}
              maskAreaStates={maskAreaStates}
            />
            <MotionDetectionSettings/>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

MotionDetection.propTypes = {
  motionDetectionSettings: PropTypes.shape({
    isEnable: PropTypes.bool.isRequired,
    sensibility: PropTypes.number.isRequired,
    areas: PropTypes.arrayOf(PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired
    }).isRequired).isRequired
  }).isRequired
};

export default withGlobalStatus(MotionDetection);
