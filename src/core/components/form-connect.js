import React from 'react';
import PropTypes from 'prop-types';
import {connect, useFormikContext} from 'formik';

/**
 * (HOF version)
 * Form data connect helper with popular form library like `formik` to use with functional component.
 * If we want to change to others like `react-hook-form`,
 * we can update syntax like the following to affect all connected component:
 * @example
 * import { useFormContext } from "react-hook-form";
 *   export const ConnectForm = ({ children }) => {
 *     const methods = useFormContext();
 *     return React.Children.map(props, (child) => {
 *       return React.cloneElement(child, {
 *         ...methods,
 *         ...child.props
 *       });
 *     });
 *   };
 * @param {Function} component
 * @returns {Component}
 */
export const connectForm = component => {
  return connect(component);
};

/**
 * (HOC/F version)
 * Form data connect helper with popular form library like `formik` to use with functional component.
 * If we want to change to others like `react-hook-form`,
 * we can update syntax like the following to affect all connected component:
 * @example
 * import { useFormContext } from "react-hook-form";
 *   export const ConnectForm = ({ children }) => {
 *     const methods = useFormContext();
 *     return children({ ...methods });
 *   };
 * @param {Object} _
 * @prop {Function|Object} children
 * @returns {Component}
 */
export const ConnectForm = ({children}) => {
  const formContext = useFormikContext();
  if (typeof children === 'object' && children.$$typeof.toString() === 'Symbol(react.element)') {
    return React.Children.map(
      children,
      child => {
        return React.cloneElement(child, {
          ...formContext,
          ...child.props
        });
      });
  }

  return children(formContext);
};

ConnectForm.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object
  ]).isRequired
};
