import classNames from 'classnames';
import download from 'downloadjs';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import {getRouter} from '@benson.liao/capybara-router';
import Modal from 'react-bootstrap/Modal';
import progress from 'nprogress';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import i18n from '../../../i18n';
import api from '../../../core/apis/web-api';
import CustomNotifyModal from '../../../core/components/custom-notify-modal';
import CustomTooltip from '../../../core/components/tooltip';
import databaseEncryptionValidator from '../../validations/members/database-encryption-validator';
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
  const [file, setFile] = useState(null);

  const onChangeFile = event => {
    setFile(event.target.files[0]);
  };

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
      apiProcessModalTitle: i18n.t('userManagement.members.modal.database.exportApiProcessModalTitle')
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

  // const onClickImportButton = event => {
  //   event.target.value = null;
  // };

  const importDatabaseFile = () => {
    if (!file || isApiProcessing) {
      return;
    }

    progress.start();
    setState(prevState => ({
      ...prevState,
      isShowApiProcessModal: true,
      apiProcessModalTitle: i18n.t('userManagement.members.modal.database.importApiProcessModalTitle')
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
    <div className="col-center">
      <div className="card shadow">
        <div className="card-header">{i18n.t('demo.userManagement.members.databaseSettings')}</div>
        <div className="card-body">
          <div className="form-group d-flex justify-content-between align-items-center">
            <label className="my-3">{i18n.t('demo.userManagement.members.encryptionSettings')}</label>
            <a href="#" onClick={showDatabaseModal}>{i18n.t('demo.userManagement.members.edit')}</a>
          </div>
          <div className="form-group">
            <label className="mb-3">{i18n.t('demo.userManagement.members.exportDB')}</label>
            <div>
              <button
                disabled={isApiProcessing}
                type="button"
                className="btn btn-outline-primary rounded-pill px-5"
                onClick={onClickExportDatabase}
              >
                {i18n.t('userManagement.members.export')}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="mb-0">{i18n.t('demo.userManagement.members.importDB')}</label>
            <small className="form-text text-muted my-2">{i18n.t('common.fileHandler.importHelper')}</small>
            <div>
              <label className="btn btn-outline-primary rounded-pill font-weight-bold px-5">
                <input type="file" className="d-none" accept="application/zip" onChange={onChangeFile}/>
                {i18n.t('common.fileHandler.selectFile')}
              </label>
              {
                file ?
                  <span className="text-size-14 text-muted ml-3">{i18n.t(file.name)}</span> :
                  <span className="text-size-14 text-muted ml-3">{i18n.t('common.fileHandler.noFileSelected')}</span>
              }
            </div>
            <div>
              <CustomTooltip show={!file} title={i18n.t('common.fileHandler.tooltip.disabledButton')}>
                <span>
                  <button
                    disabled={isApiProcessing || !file}
                    className="btn btn-outline-primary rounded-pill px-5"
                    type="button"
                    style={file ? {} : {pointerEvents: 'none'}}
                    onClick={importDatabaseFile}
                  >
                    {i18n.t('userManagement.members.import')}
                  </button>
                </span>
              </CustomTooltip>
            </div>
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
                    <h5 className="modal-title">{i18n.t('userManagement.members.modal.database.title')}</h5>
                  </div>
                  <div className="modal-body">
                    <div className="form-group has-feedback">
                      <label>{i18n.t('common.password.password')}</label>
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
                      <label>{i18n.t('common.password.newPassword')}</label>
                      <Field
                        name="newPassword"
                        component={Password}
                        inputProps={{
                          className: classNames('form-control', {'is-invalid': errors.newPassword && touched.newPassword}),
                          placeholder: i18n.t('common.password.newPasswordPlaceholder')
                        }}
                      />
                      <small className="form-text text-muted">
                        {i18n.t('common.password.passwordHelper')}
                      </small>
                      <ErrorMessage component="div" name="newPassword" className="invalid-feedback"/>
                    </div>
                    <div className="form-group has-feedback">
                      <label>{i18n.t('common.password.confirmNewPassword')}</label>
                      <Field
                        name="confirmPassword"
                        component={Password}
                        inputProps={{
                          className: classNames('form-control', {'is-invalid': errors.confirmPassword && touched.confirmPassword}),
                          placeholder: i18n.t('common.password.confirmNewPasswordPlaceholder')
                        }}
                      />
                      <ErrorMessage component="div" name="confirmPassword" className="invalid-feedback"/>
                    </div>
                  </div>
                  <div className="modal-footer flex-column">
                    <div className="form-group w-100 mx-0">
                      <button disabled={isApiProcessing} type="submit" className="btn btn-primary btn-block rounded-pill">
                        {i18n.t('common.button.confirm')}
                      </button>
                    </div>
                    <button
                      type="button"
                      className="btn btn-info btn-block m-0 rounded-pill"
                      onClick={hideDatabaseModal}
                    >
                      {i18n.t('common.button.close')}
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
            onHide={hideApiProcessModal}
          />
        </div>

      </div>
    </div>

  );
};

MembersDatabase.propTypes = {isApiProcessing: PropTypes.bool.isRequired};

export default MembersDatabase;
