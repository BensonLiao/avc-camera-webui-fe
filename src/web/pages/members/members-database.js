const classNames = require('classnames');
const download = require('downloadjs');
const {Formik, Form, Field, ErrorMessage} = require('formik');
const {getRouter} = require('capybara-router');
const Modal = require('react-bootstrap/Modal').default;
const progress = require('nprogress');
const PropTypes = require('prop-types');
const React = require('react');
const i18n = require('../../i18n').default;
const api = require('../../../core/apis/web-api');
const CustomNotifyModal = require('../../../core/components/custom-notify-modal');
const CustomTooltip = require('../../../core/components/tooltip');
const databaseEncryptionValidator = require('../../validations/members/database-encryption-validator');
const iconLock = require('../../../resource/lock-24px.svg');
const Password = require('../../../core/components/fields/password');
const utils = require('../../../core/utils');
const wrappedApi = require('../../../core/apis');

module.exports = class MembersDatabase extends React.PureComponent {
  static get propTypes() {
    return {isApiProcessing: PropTypes.bool.isRequired};
  }

  state = {
    isShowDatabaseModal: false,
    databaseInitialValues: null,
    databaseFile: null,
    isShowApiProcessModal: false,
    apiProcessModalTitle: ''
  }

  hideDatabaseModal = () => {
    this.setState({isShowDatabaseModal: false});
  };

  showDatabaseModal = event => {
    event.preventDefault();
    progress.start();
    api.member.getDatabaseEncryptionSettings()
      .then(response => {
        this.setState({
          isShowDatabaseModal: true,
          databaseInitialValues: {
            password: response.data.password,
            newPassword: '',
            confirmPassword: ''
          }
        });
      })
      .finally(progress.done);
  };

  hideApiProcessModal = () => {
    this.setState({isShowApiProcessModal: false});
  };

  onClickExportDatabase = event => {
    event.preventDefault();
    progress.start();
    this.setState({
      isShowApiProcessModal: true,
      apiProcessModalTitle: i18n.t('Exporting Member Database')
    },
    () => {
      wrappedApi({
        method: 'get',
        url: '/api/members/database.zip',
        timeout: 3 * 60 * 1000,
        responseType: 'blob',
        onDownloadProgress: progressEvent => {
          // Do whatever you want with the native progress event
          this.setState({progressPercentage: Math.round((progressEvent.loaded / progressEvent.total) * 100)});
        }
      })
        .then(response => {
          download(response.data, 'database');
        })
        .finally(() => {
          progress.done();
          this.hideApiProcessModal();
        });
    });
  };

  onClickImportButton = event => {
    event.target.value = null;
  }

  onChangeDatabaseFile = event => {
    const file = event.target.files[0];

    if (!file || this.state.$isApiProcessing) {
      return;
    }

    progress.start();
    this.setState({
      isShowApiProcessModal: true,
      apiProcessModalTitle: i18n.t('Updating Members')
    }, () => {
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
          this.hideApiProcessModal();
        });
    });
  };

  onSubmitDatabaseForm = values => {
    progress.start();
    api.member.updateDatabaseEncryptionSettings(values)
      .then(() => {
        this.setState({isShowDatabaseModal: false});
      })
      .finally(progress.done);
  };

  databaseEncryptionFormRender = ({errors, touched}) => {
    const {isApiProcessing} = this.props;
    return (
      <Form className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">{i18n.t('Database Encryption')}</h5>
        </div>
        <div className="modal-body">
          <div className="form-group has-feedback">
            <label>{i18n.t('Current Password')}</label>
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
                placeholder: i18n.t('Enter your password')
              }}
            />
            <small className="form-text text-muted">
              {i18n.t('8-16 characters: at least one uppercase and lowercase letter, number, and symbol excluding #, %, &, `, ", \\, <, > and space')}
            </small>
            <ErrorMessage component="div" name="newPassword" className="invalid-feedback"/>
          </div>
          <div className="form-group has-feedback">
            <label>{i18n.t('Confirm Password')}</label>
            <Field
              name="confirmPassword"
              component={Password}
              inputProps={{
                className: classNames('form-control', {'is-invalid': errors.confirmPassword && touched.confirmPassword}),
                placeholder: i18n.t('Confirm Your New Password')
              }}
            />
            <ErrorMessage component="div" name="confirmPassword" className="invalid-feedback"/>
          </div>
        </div>
        <div className="modal-footer flex-column">
          <div className="form-group w-100 mx-0">
            <button disabled={isApiProcessing} type="submit" className="btn btn-primary btn-block rounded-pill">
              {i18n.t('Modify')}
            </button>
          </div>
          <button
            type="button"
            className="btn btn-info btn-block m-0 rounded-pill"
            onClick={this.hideDatabaseModal}
          >
            {i18n.t('Close')}
          </button>
        </div>
      </Form>
    );
  };

  render() {
    const {isApiProcessing} = this.props;
    const {isShowApiProcessModal, apiProcessModalTitle, databaseInitialValues, isShowDatabaseModal} = this.state;

    return (
      <>
        <div className="sub-title py-2 px-4">
          <h3>{i18n.t('Database')}</h3>
          <CustomTooltip title={i18n.t('Encryption Settings')}>
            <button className="btn btn-link p-0" type="button" onClick={this.showDatabaseModal}>
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
              onClick={this.onClickExportDatabase}
            >
              {i18n.t('Export')}
            </button>
          </div>
          <label className={classNames('btn btn-outline-primary btn-block rounded-pill font-weight-bold', {disabled: isApiProcessing})}>
            <input
              type="file"
              className="d-none"
              accept="application/zip"
              onClick={this.onClickImportButton}
              onChange={this.onChangeDatabaseFile}
            />{i18n.t('Import')}
          </label>
        </div>

        {/* Database encryption */}
        <Modal
          show={isShowDatabaseModal}
          autoFocus={false}
          onHide={this.hideDatabaseModal}
        >
          <Formik
            initialValues={databaseInitialValues}
            validate={utils.makeFormikValidator(databaseEncryptionValidator, ['newPassword', 'confirmPassword'])}
            onSubmit={this.onSubmitDatabaseForm}
          >
            {this.databaseEncryptionFormRender}
          </Formik>
        </Modal>

        {/* Database updating modal */}
        <CustomNotifyModal
          modalType="process"
          backdrop="static"
          isShowModal={isShowApiProcessModal}
          modalTitle={apiProcessModalTitle}
          modalBody="Member Database Updating"
          onHide={this.hideApiProcessModal}
        />
      </>
    );
  }
};
