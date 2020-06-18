const classNames = require('classnames');
const {Formik, Form, Field} = require('formik');
const Modal = require('react-bootstrap/Modal').default;
const PropTypes = require('prop-types');
const React = require('react');
const _ = require('../../languages');
const CustomTooltip = require('./tooltip');
const CustomNotifyModal = require('./custom-notify-modal');
const databaseEncryptionValidator = require('../../web/validations/members/database-encryption-validator');
const iconLock = require('../../resource/lock-24px.svg');
const Password = require('./fields/password');
const utils = require('../utils');

module.exports = class MemberDatabase extends React.PureComponent {
  static get propTypes() {
    return {
      isApiProcessing: PropTypes.bool.isRequired,
      showModal: PropTypes.bool.isRequired,
      initalValues: PropTypes.shape({
        password: PropTypes.string.isRequired,
        newPassword: PropTypes.string.isRequired,
        confirmPassword: PropTypes.string.isRequired
      }),
      hideApiProcessModal: PropTypes.func.isRequired,
      isShowApiProcessModal: PropTypes.bool.isRequired,
      apiProcessModalTitle: PropTypes.string.isRequired,
      onSubmitForm: PropTypes.func.isRequired,
      onClickExport: PropTypes.func.isRequired,
      onChangeFile: PropTypes.func.isRequired,
      hideDatabaseModal: PropTypes.func.isRequired,
      showDatabaseModal: PropTypes.func.isRequired
    };
  }

  static get defaultProps() {
    return {
      initalValues: {
        password: '',
        newPassword: '',
        confirmPassword: ''
      }
    };
  }

  databaseEncryptionFormRender = ({errors, touched}) => {
    const {isApiProcessing, hideDatabaseModal} = this.props;
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
            <Field name="newPassword" component={Password}
              inputProps={{
                className: classNames('form-control', {'is-invalid': errors.newPassword && touched.newPassword}),
                placeholder: _('Enter your password')
              }}/>
            <small className="form-text text-muted">{_('8-16 characters, letters, numbers and/or symbols')}</small>
            {
              errors.newPassword && touched.newPassword && (
                <div className="invalid-feedback">{errors.newPassword}</div>
              )
            }
          </div>
          <div className="form-group has-feedback">
            <label>{_('Confirm Password')}</label>
            <Field name="confirmPassword" component={Password}
              inputProps={{
                className: classNames('form-control', {'is-invalid': errors.confirmPassword && touched.confirmPassword}),
                placeholder: _('Confirm your password')
              }}/>
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
          <button type="button" className="btn btn-info btn-block m-0 rounded-pill"
            onClick={hideDatabaseModal}
          >
            {_('Close')}
          </button>
        </div>
      </Form>
    );
  };

  render() {
    const {isApiProcessing,
      showModal,
      initalValues,
      hideApiProcessModal,
      isShowApiProcessModal,
      apiProcessModalTitle,
      onSubmitForm,
      onClickExport,
      onChangeFile,
      hideDatabaseModal,
      showDatabaseModal} = this.props;

    return (
      <>
        <div className="sub-title py-2 px-4">
          <h3>{_('Database')}</h3>
          <CustomTooltip title={_('Encryption Settings')}>
            <button className="btn btn-link p-0" type="button" onClick={showDatabaseModal}>
              <img src={iconLock}/>
            </button>
          </CustomTooltip>
        </div>
        <div className="actions px-4 py-3">
          <div className="form-group">
            <button disabled={isApiProcessing} type="button"
              className="btn btn-outline-primary btn-block rounded-pill"
              onClick={onClickExport}
            >
              {_('Export')}
            </button>
          </div>
          <label className={classNames('btn btn-outline-primary btn-block rounded-pill font-weight-bold', {disabled: isApiProcessing})}>
            <input type="file" className="d-none" accept=".zip" onChange={onChangeFile}/>{_('Import')}
          </label>
        </div>

        {/* Databse updating modal */}
        <CustomNotifyModal
          modalType="process"
          isShowModal={isShowApiProcessModal}
          modalTitle={apiProcessModalTitle}
          modalBody="Member Database Updating"
          onHide={hideApiProcessModal}/>

        {/* Database encryption */}
        <Modal
          show={showModal}
          autoFocus={false}
          onHide={hideDatabaseModal}
        >
          <Formik
            initialValues={initalValues}
            validate={utils.makeFormikValidator(databaseEncryptionValidator, ['newPassword', 'confirmPassword'])}
            onSubmit={onSubmitForm}
          >
            {this.databaseEncryptionFormRender}
          </Formik>
        </Modal>
      </>
    );
  }
};
