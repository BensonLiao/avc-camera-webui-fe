import classNames from 'classnames';
import {Link} from 'capybara-router';
import PropTypes from 'prop-types';
import React from 'react';

/**
 * Component for showing breadcrumbs for the current page.
 * @typedef {object} Props
 * @prop {string} className - additional classnames
 * @prop {array} path - string of path names, in order
 * @prop {array} routes - string of routes to link to, in order
 * @returns {component}
 */
const BreadCrumb = ({className, path, routes}) => {
  return (
    <div className={classNames('col-12', className)}>
      <nav>
        <ol className="breadcrumb rounded-pill">
          {path.map((value, index) => {
            return (
              path.length === index + 1 ?
                (<li key={value} className="breadcrumb-item">{value}</li>) :
                (
                  <li key={value} className="breadcrumb-item active">
                    <Link to={routes[index]}>{value}</Link>
                  </li>
                )
            );
          })}
        </ol>
      </nav>
    </div>
  );
};

BreadCrumb.propTypes = {
  path: PropTypes.array.isRequired,
  routes: PropTypes.array,
  className: PropTypes.string
};

BreadCrumb.defaultProps = {
  className: '',
  routes: []
};

export default BreadCrumb;
