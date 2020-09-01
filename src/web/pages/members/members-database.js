const classNames = require('classnames');
const download = require('downloadjs');
const {Formik, Form, Field} = require('formik');
const {getRouter} = require('capybara-router');
const Modal = require('react-bootstrap/Modal').default;
const progress = require('nprogress');
const PropTypes = require('prop-types');
const React = require('react');
const _ = require('../../../languages');
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
    apiProcessModalTitle: _('Updating members')
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
      apiProcessModalTitle: _('Exporting member database')
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

  onChangeDatabaseFile = event => {
    const file = event.target.files[0];
    if (!file || this.state.$isApiProcessing) {
      return;
    }

    progress.start();
    this.setState({isShowApiProcessModal: true}, () => {
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
          <h5 className="modal-title">{_('Database Encryption')}</h5>
        </div>
        <div className="modal-body">
          <div className="form-group has-feedback">
            <label>{_('Old Password')}</label>
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
            {
              errors.password && touched.password && (
                <div className="invalid-feedback">{errors.password}</div>
              )
            }
          </div>
          <div className="form-group has-feedback">
            <label>{_('New Password')}</label>
            <Field
              name="newPassword"
              component={Password}
              inputProps={{
                className: classNames('form-control', {'is-invalid': errors.newPassword && touched.newPassword}),
                placeholder: _('Enter your password')
              }}
            />
            <small className="form-text text-muted">
              {_('8-16 characters: at least one uppercase and lowercase letter, number, and symbol excluding #, %, &, `, ", \\, <, > and space')}
            </small>
            {
              errors.newPassword && touched.newPassword && (
                <div className="invalid-feedback">{errors.newPassword}</div>
              )
            }
          </div>
          <div className="form-group has-feedback">
            <label>{_('Confirm Password')}</label>
            <Field
              name="confirmPassword"
              component={Password}
              inputProps={{
                className: classNames('form-control', {'is-invalid': errors.confirmPassword && touched.confirmPassword}),
                placeholder: _('Confirm your password')
              }}
            />
            {
              errors.confirmPassword && touched.confirmPassword && (
                <div className="invalid-feedback">{errors.confirmPassword}</div>
              )
            }
          </div>
        </div>
        <div className="modal-footer flex-column">
          <div className="form-group w-100 mx-0">
            <button disabled={isApiProcessing} type="submit" className="btn btn-primary btn-block rounded-pill">
              {_('Modify')}
            </button>
          </div>
          <button
            type="button"
            className="btn btn-info btn-block m-0 rounded-pill"
            onClick={this.hideDatabaseModal}
          >
            {_('Close')}
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
          <h3>{_('Database')}</h3>
          <CustomTooltip title={_('Encryption Settings')}>
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
              {_('Export')}
            </button>
          </div>
          <label className={classNames('btn btn-outline-primary btn-block rounded-pill font-weight-bold', {disabled: isApiProcessing})}>
            <input type="file" className="d-none" accept=".zip" onChange={this.onChangeDatabaseFile}/>{_('Import')}
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
