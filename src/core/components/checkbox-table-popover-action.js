import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import {useContextState} from '../../web/stateProvider';
import CustomTooltip from './tooltip';
import i18n from '../../i18n';

/**
 * Component that pop-up when there's any selected items to perform items actions
 * @typedef {object} Props
 * @prop {Number?} items - How many items are selected, omit to use context hook state
 * @prop {Array<Object>} actions - item actions, e.g. delete
 * @returns {component}
 */
const CheckboxTablePopoverAction = ({items, actions}) => {
  const numberOfTopDisplayActions = 2;
  const {tableState: {current: selectedRow}, deselectAllHandler} = useContextState();
  const selectedItems = items === null ? selectedRow?.length : items;
  return (
    <div className={classnames('float-action-buttons bottom center', {'show mb-8x': selectedItems > 0})}>
      {selectedItems > 0 && (
        <div className="action-buttons">
          <span className="mr-3">
            {selectedItems} {i18n.t('common.table.popover.selected')}
          </span>
          <span className="group-buttons">
            {actions.slice(0, numberOfTopDisplayActions).map(({icon, text, func, disabled}, idx) => {
              return (
                <CustomTooltip key={String(idx)} title={text}>
                  <button
                    type="button"
                    className={classnames('btn btn-primary text-white', {'disabled shadow-none': disabled})}
                    style={{cursor: disabled ? 'default' : 'pointer'}}
                    onClick={disabled ? null : func}
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
  items: PropTypes.number,
  actions: PropTypes.arrayOf(PropTypes.shape({
    icon: PropTypes.element,
    text: PropTypes.string.isRequired,
    func: PropTypes.func,
    disabled: PropTypes.bool
  })).isRequired
};

CheckboxTablePopoverAction.defaultProps = {items: null};

export default CheckboxTablePopoverAction;

