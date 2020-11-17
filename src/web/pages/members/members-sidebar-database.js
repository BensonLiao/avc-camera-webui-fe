import classNames from 'classnames';
import download from 'downloadjs';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import {getRouter} from 'capybara-router';
import Modal from 'react-bootstrap/Modal';
import progress from 'nprogress';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import i18n from '../../../i18n';
import api from '../../../core/apis/web-api';
import CustomNotifyModal from '../../../core/components/custom-notify-modal';
import CustomTooltip from '../../../core/components/tooltip';
import databaseEncryptionValidator from '../../validations/members/database-encryption-validator';
import iconLock from '../../../resource/lock-24px.svg';
import Password from '../../../core/components/fields/password';
import wrappedApi from '../../../core/apis';

const MembersDatabase = ({isApiProcessing}) => {
  const [state, setState] = useState({
    isShowDatabaseModal: false,
    databaseInitialValues: null,
    isShowApiProcessModal: false,
    apiProcessModalTitle: ''
  });
  const {isShowApiProcessModal, apiProcessModalTitle, databaseInitialValues, isShowDatabaseModal} = state;

  const hideDatabaseModal = () => {
    setState(prevState => ({
      ...prevState,
      isShowDatabaseModal: false
    }));
  };

  const showDatabaseModal = event => {
    event.preventDefault();
    progress.start();
    api.member.getDatabaseEncryptionSettings()
      .then(response => {
        setState(prevState => ({
          ...prevState,
          isShowDatabaseModal: true,
          databaseInitialValues: {
            password: response.data.password,
            newPassword: '',
            confirmPassword: ''
          }
        }));
      })
      .finally(progress.done);
  };

  const hideApiProcessModal = () => {
    setState(prevState => ({
      ...prevState,
      isShowApiProcessModal: false
    }));
  };

  const onClickExportDatabase = event => {
    event.preventDefault();
    progress.start();
    setState(prevState => ({
      ...prevState,
      isShowApiProcessModal: true,
      apiProcessModalTitle: i18n.t('Exporting Member Database')
    }));
    wrappedApi({
      method: 'get',
      url: '/api/members/database.zip',
      timeout: 3 * 60 * 1000,
      responseType: 'blob',
      onDownloadProgress: progressEvent => {
        // Do whatever you want with the native progress event
        setState(prevState => ({
          ...prevState,
          progressPercentage: Math.round((progressEvent.loaded / progressEvent.total) * 100)
        }));
      }
    })
      .then(response => {
        download(response.data, 'database');
      })
      .finally(() => {
        progress.done();
        hideApiProcessModal();
      });
  };

  const onClickImportButton = event => {
    event.target.value = null;
  };

  const onChangeDatabaseFile = event => {
    const file = event.target.files[0];

    if (!file || isApiProcessing) {
      return;
    }

    progress.start();
    setState(prevState => ({
      ...prevState,
      isShowApiProcessModal: true,
      apiProcessModalTitle: i18n.t('Importing Member Database')
    }));
    api.member.uploadDatabaseFile(file)
      .then(() => {
        getRouter().go(
          {
            name: 'web.users.members',
            params: {}
          },
          {reload: true}
        );
      })
      .catch(() => {
        progress.done();
        hideApiProcessModal();
      });
  };

  const onSubmitDatabaseEncryptionForm = values => {
    progress.start();
    api.member.updateDatabaseEncryptionSettings(values)
      .then(() => {
        setState(prevState => ({
          ...prevState,
          isShowDatabaseModal: false
        }));
      })
      .finally(progress.done);
  };

  return (
    <>
      <div className="sub-title py-2 px-4">
        <h3>{i18n.t('Database')}</h3>
        <CustomTooltip title={i18n.t('Encryption Settings')}>
          <button className="btn btn-link p-0" type="button" onClick={showDatabaseModal}>
            <img src={iconLock}/>
          </button>
        </CustomTooltip>
      </div>
      <div className="actions px-4 py-3">
        <div className="form-group">
          <button
            disabled={isApiProcessing}
            type="button"
            className="btn btn-outline-primary btn-block rounded-pill"
            onClick={onClickExportDatabase}
          >
            {i18n.t('Export')}
          </button>
        </div>
        <label className={classNames('btn btn-outline-primary btn-block rounded-pill font-weight-bold', {disabled: isApiProcessing})}>
          <input
            type="file"
            className="d-none"
            accept="application/zip"
            onClick={onClickImportButton}
            onChange={onChangeDatabaseFile}
          />{i18n.t('Import')}
        </label>
      </div>

      {/* Database encryption */}
      <Modal
        show={isShowDatabaseModal}
        autoFocus={false}
        onHide={hideDatabaseModal}
      >
        <Formik
          initialValues={databaseInitialValues}
          validate={databaseEncryptionValidator}
          onSubmit={onSubmitDatabaseEncryptionForm}
        >
          {({errors, touched}) => (
            <Form className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{i18n.t('Database Encryption')}</h5>
              </div>
              <div className="modal-body">
                <div className="form-group has-feedback">
                  <label>{i18n.t('Password')}</label>
                  <Field
                    name="password"
                    component={Password}
                    inputProps={{
                      readOnly: true,
                      className: classNames(
                        'form-control',
                        {'is-invalid': errors.password && touched.password}
                      )
                    }}
                  />
                  <ErrorMessage component="div" name="password" className="invalid-feedback"/>
                </div>
                <div className="form-group has-feedback">
                  <label>{i18n.t('New Password')}</label>
                  <Field
                    name="newPassword"
                    component={Password}
                    inputProps={{
                      className: classNames('form-control', {'is-invalid': errors.newPassword && touched.newPassword}),
                      placeholder: i18n.t('Enter a new password')
                    }}
                  />
                  <small className="form-text text-muted">
                    {i18n.t('8-16 characters: at least one uppercase and lowercase letter, number, and symbol excluding #, %, &, `, ", \\, <, > and space')}
                  </small>
                  <ErrorMessage component="div" name="newPassword" className="invalid-feedback"/>
                </div>
                <div className="form-group has-feedback">
                  <label>{i18n.t('Confirm New Password')}</label>
                  <Field
                    name="confirmPassword"
                    component={Password}
                    inputProps={{
                      className: classNames('form-control', {'is-invalid': errors.confirmPassword && touched.confirmPassword}),
                      placeholder: i18n.t('Enter the new password again')
                    }}
                  />
                  <ErrorMessage component="div" name="confirmPassword" className="invalid-feedback"/>
                </div>
              </div>
              <div className="modal-footer flex-column">
                <div className="form-group w-100 mx-0">
                  <button disabled={isApiProcessing} type="submit" className="btn btn-primary btn-block rounded-pill">
                    {i18n.t('Confirm')}
                  </button>
                </div>
                <button
                  type="button"
                  className="btn btn-info btn-block m-0 rounded-pill"
                  onClick={hideDatabaseModal}
                >
                  {i18n.t('Close')}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>

      {/* Database updating modal */}
      <CustomNotifyModal
        modalType="process"
        backdrop="static"
        isShowModal={isShowApiProcessModal}
        modalTitle={apiProcessModalTitle}
        modalBody={i18n.t('Updating Member Database')}
        onHide={hideApiProcessModal}
      />
    </>
  );
};

MembersDatabase.propTypes = {isApiProcessing: PropTypes.bool.isRequired};

export default MembersDatabase;
