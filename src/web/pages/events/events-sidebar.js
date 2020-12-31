import classNames from 'classnames';
import {Link, getRouter} from '@benson.liao/capybara-router';
import PropTypes from 'prop-types';
import React from 'react';
import i18n from '../../../i18n';
import EventsSidebarFR from './events-sidebar-fr';

const EventsSidebar = ({
  authStatus: {isEnableFaceRecognitionKey, isEnableAgeGenderKey, isEnableHumanoidDetectionKey},
  type, currentRouteName, params, isApiProcessing
}) => {
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

  return (
    <div className="left-menu fixed-top sub shadow-sm">
      <h2>{i18n.t('userManagement.events.title')}</h2>
      <div className="filter-wrapper">
        <div className="header d-flex justify-content-between align-items-center  text-size-12">
          <span>{i18n.t('userManagement.events.filters')}</span>
          <a className="text-primary font-weight-bold" href="#" onClick={onClickClearFilters}>{i18n.t('userManagement.events.clear')}</a>
        </div>
        {/* Facial Filter */}
        {/* AVN only have facial */}
        <div className={classNames('card sub mb-3', {active: type === 'face-recognition' && isEnableFaceRecognitionKey})}>
          <div className="card-header text-truncate">
            {
              isEnableFaceRecognitionKey ? (
                <a className="text-decoration-none d-flex justify-content-between align-items-center">
                  <span>{i18n.t('userManagement.events.facialRecognition')}</span>
                  {/* Remove arrow until more smart functions are available */}
                  {/* <i className="fas fa-chevron-up"/> */}
                </a>
              ) : (
                <a className="text-decoration-none d-flex justify-content-between align-items-center">
                  <span>{i18n.t('userManagement.events.facialRecognition')}</span>
                  <span className="badge badge-danger badge-pill">{i18n.t('userManagement.events.activationRequired')}</span>
                  <i className="fas fa-chevron-down"/>
                </a>
              )
            }
          </div>
          {type === 'face-recognition' && isEnableFaceRecognitionKey && (
            <EventsSidebarFR
              params={params}
              isApiProcessing={isApiProcessing}
              currentRouteName={currentRouteName}
            />
          )}
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
                  <span>{i18n.t('userManagement.events.ageGender')}</span>
                  <i className="fas fa-chevron-down"/>
                </Link>
              ) : (
                <a className="text-decoration-none d-flex justify-content-between align-items-center">
                  <span>{i18n.t('userManagement.events.ageGender')}</span>
                  <span className="badge badge-danger badge-pill">{i18n.t('userManagement.events.activationRequired')}</span>
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
                  <span>{i18n.t('userManagement.events.humanDetection')}</span>
                  <i className="fas fa-chevron-down"/>
                </Link>
              ) : (
                <a className="text-decoration-none d-flex justify-content-between align-items-center">
                  <span>{i18n.t('userManagement.events.humanDetection')}</span>
                  <span className="badge badge-danger badge-pill">{i18n.t('userManagement.events.activationRequired')}</span>
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

// ESLint does not recognise extending proptypes from child
EventsSidebar.propTypes = {
  params: EventsSidebarFR.propTypes.params,
  currentRouteName: EventsSidebarFR.propTypes.currentRouteName,
  isApiProcessing: EventsSidebarFR.propTypes.isApiProcessing,
  authStatus: PropTypes.shape({
    isEnableFaceRecognitionKey: PropTypes.bool.isRequired,
    isEnableAgeGenderKey: PropTypes.bool.isRequired,
    isEnableHumanoidDetectionKey: PropTypes.bool.isRequired
  }).isRequired,
  type: PropTypes.string.isRequired
};

export default EventsSidebar;
