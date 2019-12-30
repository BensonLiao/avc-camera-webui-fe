const progress = require('nprogress');
const classNames = require('classnames');
const PropTypes = require('prop-types');
const React = require('react');
const Modal = require('react-bootstrap/Modal').default;
const {getRouter} = require('capybara-router');
const {Formik, Form, Field} = require('formik');
const GroupSchema = require('webserver-form-schema/group-schema');
const utils = require('../../../core/utils');
const api = require('../../../core/apis/web-api');
const _ = require('../../../languages');
const groupValidator = require('../../validations/groups/group-validator');
const Base = require('../shared/base');
const {MEMBERS_PAGE_GROUPS_MAX} = require('../../../core/constants');

module.exports = class Group extends Base {
  static get propTypes() {
    return {
      params: PropTypes.object.isRequired,
      group: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        note: PropTypes.string
      })
    };
  }

  constructor(props) {
    super(props);
    this.state.isShowModal = true;
  }

  hideModal = () => {
    this.setState({isShowModal: false});
  };

  hiddenModal = () => {
    getRouter().go({
      name: 'web.members',
      params: this.props.params
    });
  };

  /**
   * Handler on user submit the add or update group form.
   * @param {Object} values
   * @returns {void}
   */
  onSubmitGroupForm = values => {
    progress.start();
    if (this.props.group) {
      // Update group.
      api.group.updateGroup(values)
        .then(() => {
          getRouter().go({name: 'web.members', params: this.props.params}, {reload: true});
        })
        .catch(error => {
          progress.done();
          utils.renderError(error);
        });
    } else {
      // Add group.
      api.group.addGroup(values)
        .then(() => {
          getRouter().go({name: 'web.members', params: this.props.params}, {reload: true});
        })
        .catch(error => {
          progress.done();
          utils.renderError(error);
        });
    }
  };

  groupFormRender = ({errors, touched}) => {
    const {groups, group} = this.props;
    const isAddGroupDisabled = groups.items.length >= MEMBERS_PAGE_GROUPS_MAX;

    return (
      <Form>
        <div className="modal-header">
          <h5 className="modal-title">{group ? _('Modify group') : _('Create a group')}</h5>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>{_('Name')}</label>
            <Field name="name" type="text" placeholder={_('Please enter your name.')}
              maxLength={GroupSchema.name.max}
              className={classNames('form-control', {'is-invalid': errors.name && touched.name})}/>
            {
              errors.name && touched.name && (
                <div className="invalid-feedback">{errors.name}</div>
              )
            }
            <small className="form-text text-muted">{_('Letters within 16 characters.')}</small>
          </div>
          <div className="form-group">
            <label>{_('Note')}</label>
            <Field name="note" type="text" placeholder={_('Please enter your note.')}
              maxLength={GroupSchema.note.max}
              className={classNames('form-control', {'is-invalid': errors.note && touched.note})}/>
            {
              errors.note && touched.note && (
                <div className="invalid-feedback">{errors.note}</div>
              )
            }
          </div>
        </div>
        <div className="modal-footer flex-column">
          <div className="form-group w-100 mx-0">
            <button disabled={this.state.$isApiProcessing || isAddGroupDisabled} type="submit"
              className="btn btn-primary btn-block rounded-pill"
            >
              {group ? _('Confirm') : _('Create')}
            </button>
          </div>
          <button disabled={this.state.$isApiProcessing} type="button"
            className="btn btn-secondary btn-block m-0 rounded-pill" onClick={this.hideModal}
          >
            {_('Close')}
          </button>
        </div>
      </Form>
    );
  };

  render() {
    let initialValues;
    if (this.props.group) {
      initialValues = {
        id: this.props.group.id,
        name: this.props.group.name || '',
        note: this.props.group.note || ''
      };
    } else {
      initialValues = {
        name: '',
        note: ''
      };
    }

    return (
      <Modal
        show={this.state.isShowModal}
        autoFocus={false}
        onHide={this.hideModal}
        onExited={this.hiddenModal}
      >
        <Formik
          initialValues={initialValues}
          validate={utils.makeFormikValidator(groupValidator)}
          onSubmit={this.onSubmitGroupForm}
        >
          {this.groupFormRender}
        </Formik>
      </Modal>
    );
  }
};
