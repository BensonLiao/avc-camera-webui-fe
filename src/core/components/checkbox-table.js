import PropTypes from 'prop-types';
import React, {useState, useRef, useEffect, useCallback} from 'react';
import {StateProvider} from '../../web/stateProvider';
import {connectForm} from './form-connect';
import FormikEffect from './formik-effect';

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

  /**
   * Select or un-select all checkboxes on current page
   * @returns {void}
   */
  const selectAllHandler = () => {
    if (formik.values[pageNumber]) {
      formik.setValues(formik.values.map((value, index) => {
        return index === pageNumber ?
          value.map(value => {
            value.isChecked = !isSelectAll;
            return value;
          }) :
          value;
      }));
    }

    setIsSelectAll(prevState => (!prevState));
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
    customHandler();
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
    // Check if any checkboxes has been selected
    if (values[pageNumber] && values[pageNumber].some(value => value.isChecked)) {
      // Check if all or some checkboxes has been selected
      if (values[pageNumber].some(value => !value.isChecked)) {
        // Some checkboxes are selected, set to indetermindate state
        selectAllRef.current.indeterminate = true;
      } else {
        // Manually selected all checkboxes
        selectAllRef.current.indeterminate = false;
        setIsSelectAll(true);
      }
    } else {
      // No checkboxes has been selected
      selectAllRef.current.indeterminate = false;
      setIsSelectAll(false);
    }
  }, [pageNumber]);

  return (
    <div className="col-12 pt-4 mb-5 table-responsive">
      <FormikEffect onChange={onFormValueChange}/>
      <StateProvider initialState={{
        selectAllRef,
        isSelectAll,
        selectAllHandler,
        deselectAllHandler
      }}
      >
        <table className="table custom-style">
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
