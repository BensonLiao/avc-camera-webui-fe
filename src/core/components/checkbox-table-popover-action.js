import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import {useContextState} from '../../web/stateProvider';
import CustomTooltip from './tooltip';
import i18n from '../../i18n';

/**
 * Component that pop-up when there's any selected items to perform items actions
 * @typedef {object} Props
 * @prop {Number} items - How many items are selectd
 * @prop {Array<Object>} actions - item actions, e.g. delete
 * @returns {component}
 */
const CheckboxTablePopoverAction = ({items, actions}) => {
  const numberOfTopDisplayActions = 2;
  const {deselectAllHandler} = useContextState();
  return (
    <div className={classnames('float-action-buttons bottom center', {'show mb-8x': items > 0})}>
      {items > 0 && (
        <div className="action-buttons rounded-pill">
          <span className="mr-3">
            {items} {i18n.t('common.table.popover.selected')}
          </span>
          <span className="group-buttons">
            {actions.slice(0, numberOfTopDisplayActions).map(({id, icon, text, func}) => {
              return (
                <CustomTooltip key={id} title={text}>
                  <button
                    type="button"
                    className="btn btn-primary text-white"
                    onClick={func}
                  >
                    {icon}
                  </button>
                </CustomTooltip>
              );
            })}
            {actions.length > numberOfTopDisplayActions && (
              <span key="btn-more" className="dropup">
                <CustomTooltip title={i18n.t('common.tooltip.more')}>
                  <button className="btn btn-primary dropdown-toggle caret-off" type="button" data-toggle="dropdown">
                    <i className="fas fa-ellipsis-v"/>
                  </button>
                </CustomTooltip>
                <div className="dropdown-menu dropdown-menu-right">
                  {actions.slice(numberOfTopDisplayActions).map(({id, icon, text, func}) => {
                    return (
                      <button
                        key={id}
                        type="button"
                        className="dropdown-item text-black"
                        onClick={func}
                      >
                        <span>{icon}</span>&nbsp;&nbsp;<span>{text}</span>
                      </button>
                    );
                  })}
                </div>
              </span>
            )}
          </span>
          <CustomTooltip title={i18n.t('common.table.tooltip.deselectall')}>
            <button
              type="button"
              className="vertical-hr btn btn-primary text-white cancel-button"
              onClick={deselectAllHandler}
            >
              <i className="fas fa-times align-top"/>
            </button>
          </CustomTooltip>
        </div>
      )}
    </div>
  );
};

CheckboxTablePopoverAction.propTypes = {
  items: PropTypes.number.isRequired,
  actions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    icon: PropTypes.element,
    text: PropTypes.string.isRequired,
    func: PropTypes.func
  })).isRequired
};

export default CheckboxTablePopoverAction;

