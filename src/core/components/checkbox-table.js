import PropTypes from 'prop-types';
import React, {createRef, useState, useRef, useEffect, useCallback} from 'react';
import {StateProvider} from '../../web/stateProvider';
import {connectForm} from './form-connect';
import FormikEffect from './formik-effect';
import {setRefToArray} from '../utils';

export const tableState = createRef();

/**
 * Render table with checkbox, with indeterminate state
 * @typedef {object} Props
 * @prop {Number} pageNumber - Current page number
 * @prop {JSX} children - Table head and body
 * @prop {JSX} popoverAction - Checked items actions popover component
 * @returns {component}
 */
const TableWithCheckBox = connectForm(({formik, pageNumber, customHandler = () => {}, children, popoverAction}) => {
  const [isSelectAll, setIsSelectAll] = useState(false);
  const selectAllRef = useRef();

  // Initialise tableState ref on unmount
  // Note. clear on mount has execution order issue so the other components may not render correctly
  useEffect(() => {
    setRefToArray(tableState, []);
    return () => {
      setRefToArray(tableState, []);
    };
  }, []);

  /**
   * Select or un-select all checkboxes on current page
   * @returns {void}
   */
  const selectAllHandler = () => {
    let newSelectedRow = [];
    let currentSelectedRow = tableState.current;
    if (formik.values[pageNumber]) {
      formik.setValues(formik.values.map((value, index) => {
        return index === pageNumber ?
          value.map(value => {
            value.isChecked = !isSelectAll;
            // Clear current table row data from `selectedRow`
            currentSelectedRow = currentSelectedRow.filter(row => row !== value.id);
            if (value.isChecked) {
              newSelectedRow.push(value.id);
            }

            return value;
          }) :
          value;
      }));
    }

    setIsSelectAll(prevState => (!prevState));
    setRefToArray(tableState, [...currentSelectedRow, ...newSelectedRow]);
  };

  /**
   * Select or un-select entire table row on current page
   * @param {String} rowId Selected row id
   * @returns {void}
   */
  const selectRowHandler = rowId => {
    const selectedRowIndex = tableState.current?.indexOf(rowId);
    let newSelectedRow = [];
    if (selectedRowIndex === -1) {
      newSelectedRow = newSelectedRow.concat(tableState.current, rowId);
    } else if (selectedRowIndex === 0) {
      newSelectedRow = newSelectedRow.concat(tableState.current?.slice(1));
    } else if (selectedRowIndex === tableState.current.length - 1) {
      newSelectedRow = newSelectedRow.concat(tableState.current?.slice(0, -1));
    } else if (selectedRowIndex > 0) {
      newSelectedRow = newSelectedRow.concat(
        tableState.current?.slice(0, selectedRowIndex),
        tableState.current?.slice(selectedRowIndex + 1)
      );
    }

    if (formik.values[pageNumber]) {
      formik.setValues(formik.values.map((value, index) => {
        return index === pageNumber ?
          value.map(value => {
            if (value.id === rowId) {
              value.isChecked = newSelectedRow.indexOf(rowId) !== -1;
            }

            return value;
          }) :
          value;
      }));
    }

    setRefToArray(tableState, newSelectedRow);
  };

  /**
   * Deselect all checkboxes on all page
   * @returns {void}
   */
  const deselectAllHandler = () => {
    formik.setValues(formik.values.map(value => {
      return value.map(value => {
        value.isChecked = false;
        return value;
      });
    }));

    setIsSelectAll(false);
    setRefToArray(tableState, []);
  };

  /**
   * Update `Select All` checkbox based on page navigated to
   */
  useEffect(() => {
    // Crash prevention fallback if React is less than v2.2.0, innerRef only exists after v2.2.0
    if (formik) {
      selectAllCheckboxState(formik.values);
    }
  }, [formik, selectAllCheckboxState, pageNumber]);

  /**
     * Update `Select All` checkbox based on any checkbox update
     * @param {Object} nextValues - Form next values
     * @returns {void}
     */
  const onFormValueChange = ({nextValues}) => {
    // Run custom function for form onChange
    customHandler(tableState.current);
    if (nextValues.length && nextValues.length > 0) {
      selectAllCheckboxState(nextValues);
    }
  };

  /**
   * Determine condition for table header checkbox indeterminate, check or unchecked state
   * @param {Object} values - Form values
   * @returns {void}
   */
  const selectAllCheckboxState = useCallback(values => {
    selectAllRef.current.indeterminate = false;
    // Check if any checkboxes has been selected and if page data contains in selectedRow
    if (values[pageNumber]?.some(value => value.isChecked) ||
      (values[pageNumber]?.some(value => tableState.current?.indexOf(value.id) !== -1) &&
      tableState.current?.length > 0)) {
      // Check if all or some checkboxes has been selected
      if (values[pageNumber].some(value => !value.isChecked)) {
        // Some checkboxes are selected, set to indetermindate state
        selectAllRef.current.indeterminate = true;
      } else {
        // Manually selected all checkboxes
        setIsSelectAll(true);
      }
    } else {
      // No checkboxes has been selected
      setIsSelectAll(false);
    }
  }, [pageNumber]);

  return (
    <div className="table-wrapper">
      <FormikEffect onChange={onFormValueChange}/>
      <StateProvider initialState={{
        selectAllRef,
        isSelectAll,
        tableState,
        selectRowHandler,
        selectAllHandler,
        deselectAllHandler
      }}
      >
        <table className="table">
          {children}
        </table>
        {popoverAction}
      </StateProvider>
    </div>
  );
});

TableWithCheckBox.propTypes = {
  pageNumber: PropTypes.number.isRequired,
  customHandler: PropTypes.func,
  children: PropTypes.node.isRequired,
  popoverAction: PropTypes.node
};

TableWithCheckBox.defaultProps = {popoverAction: null};

export default TableWithCheckBox;
