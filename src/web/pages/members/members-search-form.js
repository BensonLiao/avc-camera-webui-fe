import {Formik, Form, Field} from 'formik';
import {getRouter} from '@benson.liao/capybara-router';
import PropTypes from 'prop-types';
import React from 'react';
import i18n from '../../../i18n';

const MembersSearchForm = ({isApiProcessing, currentRouteName, params}) => {
  const onSubmitSearchForm = ({keyword}) => {
    getRouter().go({
      name: currentRouteName,
      params: {
        ...params,
        index: undefined,
        keyword
      }
    });
  };

  return (
    <Formik
      initialValues={{keyword: params.keyword || ''}}
      onSubmit={onSubmitSearchForm}
    >
      <Form className="form-row">
        <div className="col-auto">
          <Field name="keyword" className="form-control search-bar-expand" type="search" placeholder={i18n.t('userManagement.members.searchPlaceholder')}/>
        </div>
        <div className="col-auto">
          <button
            disabled={isApiProcessing}
            className="btn btn-outline-primary rounded-pill px-3"
            type="submit"
          >
            <i className="fas fa-search fa-fw"/> {i18n.t('userManagement.members.search')}
          </button>
        </div>
      </Form>
    </Formik>
  );
};

MembersSearchForm.propTypes = {
  isApiProcessing: PropTypes.bool.isRequired,
  currentRouteName: PropTypes.string.isRequired,
  params: PropTypes.shape({keyword: PropTypes.string}).isRequired
};

export default MembersSearchForm;
