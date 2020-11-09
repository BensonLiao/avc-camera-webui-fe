import progress from 'nprogress';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import {getRouter} from 'capybara-router';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import GroupSchema from 'webserver-form-schema/group-schema';
import utils from '../../../core/utils';
import api from '../../../core/apis/web-api';
import i18n from '../../../i18n';
import groupValidator from '../../validations/groups/group-validator';
import {MEMBERS_PAGE_GROUPS_MAX} from '../../../core/constants';
import withGlobalStatus from '../../withGlobalStatus';
import {useContextState} from '../../stateProvider';

const Group = ({groups, group, params}) => {
  const [state, setState] = useState({
    isShowModal: true,
    groupsName: groups.items.map(group => group.name)
  });
  const {isApiProcessing} = useContextState();

  const {groupsName, isShowModal} = state;

  const hideModal = () => {
    setState({
      ...state,
      isShowModal: false
    });
  };

  const hiddenModal = () => {
    getRouter().go({
      name: 'web.users.members',
      params: params
    });
  };

  /**
   * Handler on user submit the add or update group form.
   * @param {Object} values
   * @returns {void}
   */
  const onSubmitGroupForm = values => {
    progress.start();
    if (group) {
      // Update group.
      api.group.updateGroup(values)
        .then(() => {
          getRouter().go({
            name: 'web.users.members',
            params: params
          }, {reload: true});
        })
        .finally(progress.done);
    } else {
      // Add group.
      api.group.addGroup(values)
        .then(() => {
          getRouter().go({
            name: 'web.users.members',
            params: params
          }, {reload: true});
        })
        .finally(progress.done);
    }
  };

  const checkDuplicate = groupName => {
    // Perform check when creating a new group or editing a group and name has changed
    if (!group || (group && group.name !== groupName)) {
      return utils.duplicateCheck(
        groupsName,
        groupName,
        i18n.t('This name already exists in the system. Please use a different name.')
      );
    }
  };

  let initialValues;
  if (group) {
    initialValues = {
      id: group.id,
      name: group.name || '',
      note: group.note || ''
    };
  } else {
    initialValues = {
      name: '',
      note: ''
    };
  }

  return (
    <Modal
      show={isShowModal}
      autoFocus={false}
      onHide={hideModal}
      onExited={hiddenModal}
    >
      <Formik
        initialValues={initialValues}
        validate={utils.makeFormikValidator(groupValidator)}
        onSubmit={onSubmitGroupForm}
      >
        {({errors, touched}) => {
          const isAddGroupDisabled = groups.items.length >= MEMBERS_PAGE_GROUPS_MAX && !group;

          return (
            <Form>
              <div className="modal-header">
                <h5 className="modal-title">{group ? i18n.t('Edit Group') : i18n.t('Create a Group')}</h5>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>{i18n.t('Name')}</label>
                  <Field
                    name="name"
                    type="text"
                    placeholder={i18n.t('Enter a name for this group')}
                    maxLength={GroupSchema.name.max}
                    validate={checkDuplicate}
                    className={classNames('form-control', {'is-invalid': errors.name && touched.name})}
                  />
                  <ErrorMessage component="div" name="name" className="invalid-feedback"/>
                  <small className="form-text text-muted">{i18n.t('Maximum length: 32 characters')}</small>
                </div>
                <div className="form-group">
                  <label>{i18n.t('Note')}</label>
                  <Field
                    name="note"
                    type="text"
                    placeholder={i18n.t('Enter a note')}
                    maxLength={GroupSchema.note.max}
                    className={classNames('form-control', {'is-invalid': errors.note && touched.note})}
                  />
                  <ErrorMessage component="div" name="note" className="invalid-feedback"/>
                  <small className="form-text text-muted">{i18n.t('Maximum length: 256 characters')}</small>
                </div>
              </div>
              <div className="modal-footer flex-column">
                <div className="form-group w-100 mx-0">
                  <button
                    disabled={isApiProcessing || isAddGroupDisabled}
                    type="submit"
                    className="btn btn-primary btn-block rounded-pill"
                  >
                    {group ? i18n.t('Confirm') : i18n.t('Create')}
                  </button>
                </div>
                <button
                  disabled={isApiProcessing}
                  type="button"
                  className="btn btn-info btn-block m-0 rounded-pill"
                  onClick={hideModal}
                >
                  {i18n.t('Close')}
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </Modal>
  );
};

Group.propTypes = {
  params: PropTypes.object.isRequired,
  groups: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      note: PropTypes.string
    }))
  }),
  group: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    note: PropTypes.string
  })
};

Group.defaultProps = {
  groups: {},
  group: {}
};

export default withGlobalStatus(Group);
