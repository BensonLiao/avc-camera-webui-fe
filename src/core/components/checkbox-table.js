import PropTypes from 'prop-types';
import React, {useState, useRef, useEffect, useCallback, createContext, useContext} from 'react';
import FormikEffect from './formik-effect';

export const CheckboxFunctionContext = createContext();

/**
 * Component rendering checkbox in table header
 * @typedef {object} Props
 * @prop {Number} formikRef - Ref of Formik form (Formik innerRef)
 * @prop {Number} pageNumber - Current page number
 * @prop {JSX} children - Table head and body
 * @prop {JSX} popoverAction - Checked items actions popover component
 * @returns {component}
 */
const TableWithCheckBox = ({formikRef, pageNumber, children, popoverAction}) => {
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [selectedPageNumbers, setSelectedPageNumbers] = useState([]);
  const selectAllRef = useRef();

  /**
   * Select or un-select all checkboxes on current page
   * @param {Object} form - Formik form object
   * @returns {void}
   */
  const selectAllHandler = form => _ => {
    if (form.values[pageNumber]) {
      form.values[pageNumber].forEach((_, index) => {
        form.setFieldValue(`${pageNumber}.${index}.isChecked`, !isSelectAll);
      });
    }

    setIsSelectAll(prevState => (!prevState));
  };

  /**
   * Deselect all checkboxes on all page
   * @returns {void}
   */
  const deselectAllHandler = () => {
    selectedPageNumbers.forEach(selectedPageNumber => {
      if (formikRef.current.values[selectedPageNumber]) {
        formikRef.current.values[selectedPageNumber].forEach((_, index) => {
          formikRef.current.setFieldValue(`${selectedPageNumber}.${index}.isChecked`, false);
        });
      }
    });

    setIsSelectAll(false);
  };

  /**
   * Update `Select All` checkbox based on page navigated to
   */
  useEffect(() => {
    // Crash prevention fallback if React is less than v2.2.0, innerRef only exists after v2.2.0
    if (formikRef.current) {
      const values = formikRef.current.values;
      selectAllCheckboxState(values);
    }
  }, [formikRef, selectAllCheckboxState, pageNumber]);

  /**
     * Update `Select All` checkbox based on any checkbox update
     * @param {Object} nextValues - Form next values
     * @returns {void}
     */
  const onChangeCardForm = ({nextValues}) => {
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
      selectedPageNumbers.push(pageNumber);
      setSelectedPageNumbers(selectedPageNumbers);
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
      setSelectedPageNumbers(selectedPageNumbers.filter(selectedPageNumber => selectedPageNumber !== pageNumber));
    }
  }, [pageNumber, selectedPageNumbers]);

  return (
    <div className="col-12 pt-4 mb-5 table-responsive">
      <FormikEffect onChange={onChangeCardForm}/>
      <CheckboxFunctionContext.Provider value={{
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
      </CheckboxFunctionContext.Provider>
    </div>
  );
};

TableWithCheckBox.propTypes = {
  formikRef: PropTypes.object.isRequired,
  pageNumber: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
  popoverAction: PropTypes.node
};

TableWithCheckBox.defaultProps = {popoverAction: null};

export default TableWithCheckBox;

export const useContextCheckbox = () => useContext(CheckboxFunctionContext);
