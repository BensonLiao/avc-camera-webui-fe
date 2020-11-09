import classNames from 'classnames';
import {Link, getRouter} from 'capybara-router';
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
  params: PropTypes.shape(EventsSidebarFR.propTypes.params).isRequired,
  authStatus: PropTypes.shape({
    isEnableFaceRecognitionKey: PropTypes.bool.isRequired,
    isEnableAgeGenderKey: PropTypes.bool.isRequired,
    isEnableHumanoidDetectionKey: PropTypes.bool.isRequired
  }).isRequired,
  type: PropTypes.string.isRequired,
  currentRouteName: PropTypes.shape(EventsSidebarFR.propTypes.currentRouteName).isRequired,
  isApiProcessing: PropTypes.bool.isRequired
};

export default EventsSidebar;
