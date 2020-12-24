import classNames from 'classnames';
import {getRouter} from '@benson.liao/capybara-router';
import PropTypes from 'prop-types';
import React from 'react';
import i18n from '../../../i18n';
import utils from '../../../core/utils';
import Similarity from 'webserver-form-schema/constants/event-filters/similarity';
import RecognitionType from 'webserver-form-schema/constants/event-filters/recognition-type';
import ErrorDisplay from '../../../core/components/error-display';

const EventsSidebarFR = ({currentRouteName, params, isApiProcessing}) => {
  /**
   * Convert router params to an array.
   * @param {Array<String>|String|null} param
   * @returns {Array<String>}
   */
  const convertArrayParams = param => Array.isArray(param) ? [...param] : (param ? [param] : []);

  /**
   * Generate the handler to toggle filter.
   * @param {String} paramKey
   * @param {String} value
   * @returns {Function} The handler.
   */
  const toggleFilterHandler = (paramKey, value) => () => {
    const localParams = convertArrayParams(params[paramKey]);
    const indexOfConfidences = localParams.indexOf(value);

    if (indexOfConfidences >= 0) {
      localParams.splice(indexOfConfidences, 1);
    } else {
      localParams.push(value);
    }

    getRouter().go({
      name: currentRouteName,
      params: {
        ...params,
        index: undefined,
        [paramKey]: localParams
      }
    });
  };

  const confidence = convertArrayParams(params.confidence);
  const enrollStatus = convertArrayParams(params.enrollStatus);
  const similarityRender = [
    {
      confidence: Similarity.low,
      id: 'input-checkbox-low-similar'
    },
    {
      confidence: Similarity.medium,
      id: 'input-checkbox-medium-similar'
    },
    {
      confidence: Similarity.high,
      id: 'input-checkbox-high-similar'
    }
  ];
  const recognitionTypeRender = [
    {
      status: RecognitionType.registered,
      id: 'input-checkbox-register'
    },
    {
      status: RecognitionType.unknown,
      id: 'input-checkbox-anonymous'
    },
    {
      status: RecognitionType.fake,
      id: 'input-checkbox-fake'
    }
  ];

  return (

    <div className="card-body">
      <span>{i18n.t('userManagement.events.similarity')}</span>
      <div className="checkbox-group mt-3 pl-2">
        {similarityRender.map(item => (
          <div key={item.id} className="form-check mb-3">
            <input
              type="checkbox"
              className="form-check-input"
              id={item.id}
              disabled={isApiProcessing}
              checked={confidence.indexOf(item.confidence) >= 0}
              onChange={toggleFilterHandler('confidence', item.confidence)}
            />
            <label className="form-check-label" htmlFor={item.id}>
              {utils.getEventConfidenceI18N(item.confidence, <ErrorDisplay/>)}
            </label>
          </div>
        ))}
      </div>
      <span>{i18n.t('userManagement.events.status')}</span>
      <div className="checkbox-group mt-3 mb-2 pl-2">
        {recognitionTypeRender.map((item, idx) => (
          <div key={item.id} className={classNames('form-check', {'mb-3': idx < recognitionTypeRender.length - 1})}>
            <input
              type="checkbox"
              className="form-check-input"
              id={item.id}
              disabled={isApiProcessing}
              checked={enrollStatus.indexOf(item.status) >= 0}
              onChange={toggleFilterHandler('enrollStatus', item.status)}
            />
            <label className="form-check-label" htmlFor={item.id}>
              {utils.getEventRecognitionTypeI18N(item.status, <ErrorDisplay/>)}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

EventsSidebarFR.propTypes = {
  params: PropTypes.shape({
    type: PropTypes.oneOf(['face-recognition', 'age-gender', 'humanoid-detection']),
    confidence: PropTypes.oneOfType([
      PropTypes.oneOf(Similarity.all()),
      PropTypes.arrayOf(PropTypes.oneOf(Similarity.all()))
    ]),
    enrollStatus: PropTypes.oneOfType([
      PropTypes.oneOf(RecognitionType.all()),
      PropTypes.arrayOf(PropTypes.oneOf(RecognitionType.all()))
    ])
  }).isRequired,
  currentRouteName: PropTypes.string.isRequired,
  isApiProcessing: PropTypes.bool.isRequired
};

export default EventsSidebarFR;
