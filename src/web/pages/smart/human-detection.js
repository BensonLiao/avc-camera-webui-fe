import {Formik, Form} from 'formik';
import {getRouter} from '@benson.liao/capybara-router';
import progress from 'nprogress';
import PropTypes from 'prop-types';
import React, {useState, useEffect} from 'react';
import api from '../../../core/apis/web-api';
import withGlobalStatus from '../../withGlobalStatus';
import HumanDetectionSettings from './human-detection-settings';
import HumanDetectionTrigger from './human-detection-trigger';
import {HUMAN_DETECTION_TYPE} from '../../../core/constants';

const HumanDetection = ({humanDetectionSettings}) => {
  const [currentTab, setCurrentTab] = useState(HUMAN_DETECTION_TYPE.LINE);
  const [currentAreaId, setCurrentAreaId] = useState('0');
  const [currentLineId, setCurrentLineId] = useState('0');

  useEffect(() => {
    if (localStorage.getItem('currentTab') === HUMAN_DETECTION_TYPE.AREA) {
      setCurrentTab(HUMAN_DETECTION_TYPE.AREA);
    }

    localStorage.removeItem('currentTab');
  }, []);

  const onSubmit = values => {
    progress.start();
    localStorage.setItem('currentTab', currentTab);
    api.smartFunction.updateHumanDetectionSettings(values)
      .then(getRouter().reload)
      .finally(progress.done);
  };

  return (
    <div className="page-smart page-hd">
      <div className="container-fluid">
        <Formik
          initialValues={humanDetectionSettings}
          onSubmit={onSubmit}
        >
          <Form className="row">
            <div className="col-9">
              <HumanDetectionTrigger
                triggerType={currentTab}
                currentAreaId={currentAreaId}
                setCurrentAreaId={setCurrentAreaId}
                currentLineId={currentLineId}
                setCurrentLineId={setCurrentLineId}
              />
            </div>
            <div className="col-3 p-0">
              <HumanDetectionSettings
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
                currentAreaId={currentAreaId}
                setCurrentAreaId={setCurrentAreaId}
                currentLineId={currentLineId}
                setCurrentLineId={setCurrentLineId}
              />
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

HumanDetection.propTypes = {
  humanDetectionSettings: PropTypes.shape({
    isEnable: PropTypes.bool.isRequired,
    triggerArea: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      isEnable: PropTypes.bool.isRequired,
      isDisplay: PropTypes.bool.isRequired,
      stayTime: PropTypes.number.isRequired,
      stayCountLimit: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      rect: PropTypes.shape({
        bottom: PropTypes.number,
        left: PropTypes.number,
        right: PropTypes.number,
        top: PropTypes.number
      }).isRequired
    }).isRequired).isRequired,
    triggerLine: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      isEnable: PropTypes.bool.isRequired,
      isDisplay: PropTypes.bool.isRequired,
      name: PropTypes.string.isRequired,
      point: PropTypes.arrayOf(PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number
      })).isRequired
    }).isRequired).isRequired
  }).isRequired
};

export default withGlobalStatus(HumanDetection);
