import classNames from 'classnames';
import {Link, getRouter} from 'capybara-router';
import PropTypes from 'prop-types';
import React from 'react';
import i18n from '../../../i18n';
import Similarity from 'webserver-form-schema/constants/event-filters/similarity';
import RecognitionType from 'webserver-form-schema/constants/event-filters/recognition-type';

const EventsSidebar = ({
  authStatus: {isEnableFaceRecognitionKey, isEnableAgeGenderKey, isEnableHumanoidDetectionKey},
  type, currentRouteName, params, isApiProcessing
}) => {
  /**
   * Convert router params to an array.
   * @param {Array<String>|String|null} param
   * @returns {Array<String>}
   */
  const convertArrayParams = param => Array.isArray(param) ? [...param] : (param ? [param] : []);

  /**
   * Clear filter on user clicks.
   * @param {*} event
   * @returns {void}
   */
  const onClickClearFilters = event => {
    event.preventDefault();
    getRouter().go({
      name: currentRouteName,
      params: {type: type}
    });
  };

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

  const faceRecognitionFilterRender = () => {
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
        <span>{i18n.t('Similarity')}</span>
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
                {i18n.t(`confidence-${item.confidence}`)}
              </label>
            </div>
          ))}
        </div>
        <span>{i18n.t('Recognition Result')}</span>
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
                {i18n.t(`enroll-status-${item.status}`)}
              </label>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="left-menu fixed-top sub shadow-sm">
      <h2>{i18n.t('Events')}</h2>
      <div className="filter-wrapper">
        <div className="header d-flex justify-content-between align-items-center  text-size-12">
          <span>{i18n.t('Filters')}</span>
          <a className="text-primary font-weight-bold" href="#" onClick={onClickClearFilters}>{i18n.t('Clear')}</a>
        </div>
        {/* Facial Filter */}
        {/* AVN only have facial */}
        <div className={classNames('card sub mb-3', {active: type === 'face-recognition' && isEnableFaceRecognitionKey})}>
          <div className="card-header text-truncate">
            {
              isEnableFaceRecognitionKey ? (
                <a className="text-decoration-none d-flex justify-content-between align-items-center">
                  <span>{i18n.t('Facial Recognition')}</span>
                  {/* Remove arrow until more smart functions are available */}
                  {/* <i className="fas fa-chevron-up"/> */}
                </a>
              ) : (
                <a className="text-decoration-none d-flex justify-content-between align-items-center">
                  <span>{i18n.t('Facial Recognition')}</span>
                  <span className="badge badge-danger badge-pill">{i18n.t('Activation Required')}</span>
                  <i className="fas fa-chevron-down"/>
                </a>
              )
            }
          </div>
          {type === 'face-recognition' && isEnableFaceRecognitionKey && faceRecognitionFilterRender()}
        </div>
        {/* Age & Gender Filter */}
        <div className={classNames('card sub mb-3 d-none', {active: type === 'age-gender' && isEnableAgeGenderKey})}>
          <div className="card-header text-truncate">
            {
              isEnableAgeGenderKey ? (
                <Link
                  to={{
                    name: currentRouteName,
                    params: {type: 'age-gender'}
                  }}
                  className="text-decoration-none d-flex justify-content-between align-items-center"
                >
                  <span>{i18n.t('Age & Gender')}</span>
                  <i className="fas fa-chevron-down"/>
                </Link>
              ) : (
                <a className="text-decoration-none d-flex justify-content-between align-items-center">
                  <span>{i18n.t('Age & Gender')}</span>
                  <span className="badge badge-danger badge-pill">{i18n.t('Activation Required')}</span>
                  <i className="fas fa-chevron-down"/>
                </a>
              )
            }
          </div>
        </div>
        {/* Human Detection Filter */}
        <div className={classNames('card sub mb-3 d-none', {active: type === 'humanoid-detection' && isEnableHumanoidDetectionKey})}>
          <div className="card-header text-truncate">
            {
              isEnableHumanoidDetectionKey ? (
                <Link
                  to={{
                    name: currentRouteName,
                    params: {type: 'humanoid-detection'}
                  }}
                  className="text-decoration-none d-flex justify-content-between align-items-center"
                >
                  <span>{i18n.t('Human Detection')}</span>
                  <i className="fas fa-chevron-down"/>
                </Link>
              ) : (
                <a className="text-decoration-none d-flex justify-content-between align-items-center">
                  <span>{i18n.t('Human Detection')}</span>
                  <span className="badge badge-danger badge-pill">{i18n.t('Activation Required')}</span>
                  <i className="fas fa-chevron-down"/>
                </a>
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
};

EventsSidebar.propTypes = {
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
  authStatus: PropTypes.shape({
    isEnableFaceRecognitionKey: PropTypes.bool.isRequired,
    isEnableAgeGenderKey: PropTypes.bool.isRequired,
    isEnableHumanoidDetectionKey: PropTypes.bool.isRequired
  }).isRequired,
  type: PropTypes.string.isRequired,
  currentRouteName: PropTypes.string.isRequired,
  isApiProcessing: PropTypes.bool.isRequired
};

export default EventsSidebar;
