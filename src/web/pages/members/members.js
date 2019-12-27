const download = require('downloadjs');
const classNames = require('classnames');
const PropTypes = require('prop-types');
const React = require('react');
const {Formik, Form, Field} = require('formik');
const progress = require('nprogress');
const {RouterView, Link, getRouter} = require('capybara-router');
const Modal = require('react-bootstrap/Modal').default;
const iconHttps = require('webserver-prototype/src/resource/https-24px.svg');
const Base = require('../shared/base');
const Pagination = require('../../../core/components/pagination');
const Password = require('../../../core/components/fields/password');
const databaseEncryptionValidator = require('../../validations/members/database-encryption-validator');
const _ = require('../../../languages');
const utils = require('../../../core/utils');
const api = require('../../../core/apis/web-api');

module.exports = class Members extends Base {
  static get propTypes() {
    return {
      params: PropTypes.shape({
        group: PropTypes.string
      }).isRequired,
      groups: PropTypes.shape({
        items: PropTypes.arrayOf(PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          note: PropTypes.string
        }).isRequired).isRequired
      }).isRequired,
      members: PropTypes.shape({
        index: PropTypes.number.isRequired,
        size: PropTypes.number.isRequired,
        total: PropTypes.number.isRequired,
        items: PropTypes.arrayOf(PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          organization: PropTypes.string,
          groupId: PropTypes.string,
          note: PropTypes.string,
          pictures: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired
        }).isRequired).isRequired
      }).isRequired
    };
  }

  constructor(props) {
    super(props);
    this.currentRoute = getRouter().findRouteByName('web.members');
    this.state.isShowDeleteGroupModal = false;
    this.state.deleteGroupTarget = null;
    this.state.selectedGroup = props.groups.items.find(x => x.id === props.params.group);
    this.state.isShowDeleteMemberModal = false;
    this.state.deleteMemberTarget = null;
    this.state.isShowDatabaseEncryptionModal = false;
    this.state.databaseEncryptionInitialValues = null;
    this.state.databaseFile = null;
  }

  generateShowDeleteGroupModalHandler = group => {
    return event => {
      event.preventDefault();
      this.setState({
        isShowDeleteGroupModal: true,
        deleteGroupTarget: group
      });
    };
  };

  confirmDeleteGroup = event => {
    event.preventDefault();
    progress.start();
    api.group.deleteGroup(this.state.deleteGroupTarget.id)
      .then(() => {
        this.hideDeleteGroupModal();
        if (this.state.deleteGroupTarget.id === this.props.params.group) {
          getRouter().go(
            {
              name: 'web.members',
              params: {...this.props.params, group: undefined, index: undefined}
            },
            {reload: true}
          );
        } else {
          getRouter().reload();
        }
      })
      .catch(error => {
        progress.done();
        utils.renderError(error);
      });
  };

  hideDeleteGroupModal = () => {
    this.setState({isShowDeleteGroupModal: false});
  };

  generateShowDeleteMemberModalHandler = member => {
    return event => {
      event.preventDefault();
      this.setState({
        isShowDeleteMemberModal: true,
        deleteMemberTarget: member
      });
    };
  };

  confirmDeleteMember = event => {
    event.preventDefault();
    progress.start();
    api.member.deleteMember(this.state.deleteMemberTarget.id)
      .then(() => {
        this.hideDeleteMemberModal();
        getRouter().reload();
      })
      .catch(error => {
        progress.done();
        utils.renderError(error);
      });
  };

  hideDeleteMemberModal = () => {
    this.setState({isShowDeleteMemberModal: false});
  };

  /**
   * Generate the handler to change filter.
   * @param {String} paramKey
   * @param {*} value The filter value. Pass null to remove the param.
   * @returns {Function} The handler.
   */
  generateChangeFilterHandler = (paramKey, value) => event => {
    event.preventDefault();
    getRouter().go({
      name: this.currentRoute.name,
      params: {
        ...this.props.params,
        index: undefined,
        [paramKey]: value === undefined ?
          event.target.value :
          (value == null ? undefined : value)
      }
    });
  };

  onSubmitSearchForm = ({keyword}) => {
    getRouter().go({
      name: this.currentRoute.name,
      params: {
        ...this.props.params,
        index: undefined,
        keyword
      }
    });
  };

  searchFormRender = () => {
    return (
      <Form className="form-row">
        <div className="col-auto my-1">
          <Field name="keyword" className="form-control" type="text" placeholder={_('Please enter the keyword.')}/>
        </div>
        <div className="col-auto my-1">
          <button disabled={this.state.$isApiProcessing}
            className="btn btn-outline-primary rounded-pill px-3" type="submit"
          >
            <i className="fas fa-search fa-fw"/> {_('Search')}
          </button>
        </div>
      </Form>
    );
  };

  showDatabaseEncryptionModal = event => {
    event.preventDefault();
    progress.start();
    api.member.getDatabaseEncryptionSettings()
      .then(response => {
        this.setState({
          isShowDatabaseEncryptionModal: true,
          databaseEncryptionInitialValues: {
            password: response.data.password,
            newPassword: '',
            confirmPassword: ''
          }
        });
      })
      .catch(error => utils.renderError(error))
      .finally(progress.done);
  };

  hideDatabaseEncryptionModal = () => {
    this.setState({isShowDatabaseEncryptionModal: false});
  };

  onSubmitDatabaseEncryptionForm = values => {
    progress.start();
    api.member.updateDatabaseEncryptionSettings(values)
      .then(() => {
        this.setState({isShowDatabaseEncryptionModal: false});
      })
      .catch(error => utils.renderError(error))
      .finally(progress.done);
  };

  onClickExportDatabase = event => {
    event.preventDefault();
    download('/api/members/database.zip');
  };

  onChangeDatabaseFile = event => {
    const file = event.target.files[0];

    if (!file || this.state.$isApiProcessing) {
      return;
    }

    progress.start();
    api.member.uploadDatabaseFile(file)
      .then(() => {
        getRouter().go(
          {name: 'web.members', params: {}},
          {reload: true}
        );
      })
      .catch(error => {
        progress.done();
        utils.renderError(error);
      });
  };

  databaseEncryptionFormRender = ({errors, touched}) => {
    return (
      <Form className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">{_('Database encryption')}</h5>
        </div>
        <div className="modal-body">
          <div className="form-group has-feedback">
            <label>{_('Old password')}</label>
            <Field name="password" component={Password}
              inputProps={{className: classNames('form-control', {'is-invalid': errors.password && touched.password})}}/>
            {
              errors.password && touched.password && (
                <div className="invalid-feedback">{errors.password}</div>
              )
            }
          </div>
          <div className="form-group has-feedback">
            <label>{_('New password')}</label>
            <Field name="newPassword" component={Password}
              inputProps={{
                className: classNames('form-control', {'is-invalid': errors.newPassword && touched.newPassword}),
                placeholder: _('Please enter your password.')
              }}/>
            {
              errors.newPassword && touched.newPassword && (
                <div className="invalid-feedback">{errors.newPassword}</div>
              )
            }
          </div>
          <div className="form-group has-feedback">
            <label>{_('Confirm password')}</label>
            <Field name="confirmPassword" component={Password}
              inputProps={{
                className: classNames('form-control', {'is-invalid': errors.confirmPassword && touched.confirmPassword}),
                placeholder: _('Please confirm your password.')
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
            <button disabled={this.state.$isApiProcessing} type="submit" className="btn btn-primary btn-block rounded-pill">
              {_('Modify')}
            </button>
          </div>
          <button type="button" className="btn btn-secondary btn-block m-0 rounded-pill"
            onClick={this.hideDatabaseEncryptionModal}
          >
            {_('Close')}
          </button>
        </div>
      </Form>
    );
  };

  render() {
    const groups = this.props.groups.items;
    const members = this.props.members.items;
    const {selectedGroup} = this.state;
    const hrefTemplate = getRouter().generateUri(
      this.currentRoute,
      {...this.props.params, index: undefined}
    );
    const isAddGroupDisabled = groups.length >= 32;
    const sort = {
      name: {
        handler: this.generateChangeFilterHandler(
          'sort',
          (this.props.params.sort || 'name') === 'name' ? '-name' : null
        ),
        icon: classNames({
          'fas fa-fw text-muted ml-3 fa-caret-down': this.props.params.sort === '-name',
          'fas fa-fw text-muted ml-3 fa-caret-up': (this.props.params.sort || 'name') === 'name'
        })
      },
      organization: {
        handler: this.generateChangeFilterHandler(
          'sort',
          this.props.params.sort === 'organization' ? '-organization' : 'organization'
        ),
        icon: classNames({
          'fas fa-fw text-muted ml-3 fa-caret-down': this.props.params.sort === '-organization',
          'fas fa-fw text-muted ml-3 fa-caret-up': this.props.params.sort === 'organization'
        })
      },
      group: {
        handler: this.generateChangeFilterHandler(
          'sort',
          this.props.params.sort === 'group' ? '-group' : 'group'
        ),
        icon: classNames({
          'fas fa-fw text-muted ml-3 fa-caret-down': this.props.params.sort === '-group',
          'fas fa-fw text-muted ml-3 fa-caret-up': this.props.params.sort === 'group'
        })
      }
    };

    return (
      <>
        {/* Left menu */}
        <div className="left-menu fixed-top">
          <h2>{_('Members')}</h2>
          <nav className="nav flex-column">
            <Link to="/members" title={_('All members')}
              className={classNames('nav-link text-size-16 py-3', {active: !this.props.params.group})}
            >
              <i className="fas fa-user-friends pl-3 pr-4"/>{_('All members')}
            </Link>
          </nav>
          <hr/>
          <div className="groups">
            <div className="d-flex justify-content-between align-items-center mb-3 pr-3">
              <h3>{_('Groups')}</h3>
              <Link
                to={(!isAddGroupDisabled && {name: 'web.members.new-group', params: this.props.params})}
                className={classNames('btn btn-link text-light', {disabled: isAddGroupDisabled})}
              >
                <i className="fas fa-plus fa-fw fa-lg"/>
              </Link>
            </div>

            {
              groups.map(group => (
                <div key={group.id}
                  className={classNames(
                    'group-item d-flex justify-content-between align-items-center',
                    {active: this.props.params.group === group.id}
                  )}
                >
                  <a className="w-100 text-truncate" href={`#${group.id}`}
                    onClick={this.generateChangeFilterHandler('group', group.id)}
                  >
                    <i className="far fa-folder fa-lg"/>
                    <span className="text-truncate text-size-16 pl-4">{group.name}</span>
                  </a>
                  <button className="btn btn-link btn-delete text-light" type="button"
                    onClick={this.generateShowDeleteGroupModalHandler(group)}
                  >
                    <i className="far fa-trash-alt fa-fw fa-lg"/>
                  </button>
                </div>
              ))
            }

            <hr/>
            <div className="d-flex justify-content-between align-items-center mb-3 pr-3">
              <h3>{_('Database file')}</h3>
              <button className="btn btn-link text-light" type="button" onClick={this.showDatabaseEncryptionModal}>
                <img src={iconHttps}/>
              </button>
            </div>
            <div className="actions">
              <div className="form-group">
                <button disabled={this.state.$isApiProcessing} type="button"
                  className="btn btn-outline-light btn-block rounded-pill"
                  onClick={this.onClickExportDatabase}
                >
                  {_('Export')}
                </button>
              </div>
              <label className={classNames('btn btn-outline-light btn-block rounded-pill font-weight-bold', {disabled: this.state.$isApiProcessing})}>
                <input type="file" className="d-none" accept=".zip" onChange={this.onChangeDatabaseFile}/>{_('Import')}
              </label>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="main-content left-menu-active">
          <div className="page-users bg-white">
            <div className="container-fluid">
              <div className="row">
                <div className="col-12 d-flex justify-content-between mb-4">
                  <Formik initialValues={{keyword: this.props.params.keyword || ''}}
                    onSubmit={this.onSubmitSearchForm}
                  >
                    {this.searchFormRender}
                  </Formik>
                  <div className="form-row">
                    <div className="dropdown">
                      <button className="btn border-primary text-primary rounded-pill dropdown-toggle" type="button" data-toggle="dropdown">
                        <i className="fas fa-plus fa-fw text-primary"/>{_('New')}
                      </button>
                      <div className="dropdown-menu dropdown-menu-right shadow">
                        <Link className="dropdown-item"
                          to={{name: 'web.members.new-member', params: this.props.params}}
                        >
                          {_('Add a new member')}
                        </Link>
                        <Link className="dropdown-item" to="/events">{_('Add a member from events')}</Link>
                      </div>
                    </div>
                  </div>
                </div>

                {
                  selectedGroup && (
                    <div className="col-12 mb-4">
                      <i className="far fa-folder fa-fw fa-lg text-primary ml-3"/>
                      <span className="text-size-16 text-muted ml-3">{selectedGroup.name}</span>
                      <Link className="ml-5" to={{name: 'web.members.modify-group', params: this.props.params}}>
                        <i className="fas fa-pen fa-fw"/>
                      </Link>
                      <span className="text-size-14 text-muted ml-5">{selectedGroup.note}</span>
                    </div>
                  )
                }

                <div className="col-12 mb-5">
                  <table className="table custom-style" style={{tableLayout: 'fixed'}}>
                    <thead>
                      <tr className="shadow">
                        <th className="text-center" style={{width: '20%'}}>{_('Register picture')}</th>
                        <th style={{width: '15%'}}>
                          <a href="#name" onClick={sort.name.handler}>{_('Name')}</a>
                          <i className={sort.name.icon}/>
                        </th>
                        <th style={{width: '15%'}}>
                          <a href="#organization" onClick={sort.organization.handler}>{_('Organization')}</a>
                          <i className={sort.organization.icon}/>
                        </th>
                        <th style={{width: '15%'}}>
                          <a href="#group" onClick={sort.group.handler}>{_('Group')}</a>
                          <i className={sort.group.icon}/>
                        </th>
                        <th style={{width: '20%'}}>{_('Note')}</th>
                        <th style={{width: '15%'}}>{_('Actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        members.map((member, index) => {
                          const tdClass = classNames({'border-bottom': index >= members.length - 1});

                          return (
                            <tr key={member.id}>
                              <td className={classNames('text-center', tdClass)}>
                                <img className="rounded-circle" style={{height: '56px'}}
                                  src={`data:image/jpeg;base64,${member.pictures[0]}`}/>
                              </td>
                              <td className={tdClass}>{member.name}</td>
                              <td className={tdClass}>{member.organization || _('None')}</td>
                              <td className={tdClass}>{(groups.find(x => x.id === member.groupId) || {}).name || _('None')}</td>
                              <td className={tdClass}>{member.note || _('None')}</td>
                              <td className={tdClass}>
                                <Link className="btn btn-link" to={{name: 'web.members.details', params: {...this.props.params, memberId: member.id}}}>
                                  <i className="fas fa-pen fa-lg fa-fw"/>
                                </Link>
                                <button className="btn btn-link" type="button"
                                  onClick={this.generateShowDeleteMemberModalHandler(member)}
                                >
                                  <i className="far fa-trash-alt fa-lg fa-fw"/>
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      }
                    </tbody>
                  </table>
                </div>

                <Pagination index={this.props.members.index}
                  size={this.props.members.size}
                  total={this.props.members.total}
                  itemQuantity={this.props.members.items.length}
                  hrefTemplate={hrefTemplate.indexOf('?') >= 0 ? `${hrefTemplate}&index={index}` : `${hrefTemplate}?index={index}`}/>
              </div>
            </div>
            <RouterView/>
          </div>
        </div>

        {/* Delete group modal */}
        <Modal
          show={this.state.isShowDeleteGroupModal}
          autoFocus={false}
          onHide={this.hideDeleteGroupModal}
        >
          <form>
            <div className="modal-header">
              <h5 className="modal-title">{_('Delete group')}</h5>
            </div>
            <div className="modal-body">
              <span className="text-muted en-us">
                Are you sure to delete the group <strong>{this.state.deleteGroupTarget && this.state.deleteGroupTarget.name}</strong>?
              </span>
              <span className="text-muted zh-tw">
                您即將刪除<strong>{this.state.deleteGroupTarget && this.state.deleteGroupTarget.name}</strong>群組，確認要刪除嗎？
              </span>
            </div>
            <div className="modal-footer flex-column">
              <div className="form-group w-100 mx-0">
                <button disabled={this.state.$isApiProcessing} type="submit" className="btn btn-danger btn-block rounded-pill"
                  onClick={this.confirmDeleteGroup}
                >
                  {_('Delete')}
                </button>
              </div>
              <button disabled={this.state.$isApiProcessing} type="button" className="btn btn-secondary btn-block m-0 rounded-pill" onClick={this.hideDeleteGroupModal}>
                {_('Close')}
              </button>
            </div>
          </form>
        </Modal>

        {/* Delete member modal */}
        <Modal
          show={this.state.isShowDeleteMemberModal}
          autoFocus={false}
          onHide={this.hideDeleteMemberModal}
        >
          <form>
            <div className="modal-header">
              <h5 className="modal-title">{_('Delete member')}</h5>
            </div>
            <div className="modal-body">
              <span className="text-muted">
                {_('Are you sure to delete the member {0}?', [this.state.deleteMemberTarget && this.state.deleteMemberTarget.name])}
              </span>
            </div>
            <div className="modal-footer flex-column">
              <div className="form-group w-100 mx-0">
                <button disabled={this.state.$isApiProcessing} type="submit" className="btn btn-danger btn-block rounded-pill"
                  onClick={this.confirmDeleteMember}
                >
                  {_('Delete')}
                </button>
              </div>
              <button disabled={this.state.$isApiProcessing} type="button" className="btn btn-secondary btn-block m-0 rounded-pill" onClick={this.hideDeleteMemberModal}>
                {_('Close')}
              </button>
            </div>
          </form>
        </Modal>

        {/* Database encryption */}
        <Modal
          show={this.state.isShowDatabaseEncryptionModal}
          autoFocus={false}
          onHide={this.hideDatabaseEncryptionModal}
        >
          <Formik
            initialValues={this.state.databaseEncryptionInitialValues}
            validate={utils.makeFormikValidator(databaseEncryptionValidator, ['newPassword', 'confirmPassword'])}
            onSubmit={this.onSubmitDatabaseEncryptionForm}
          >
            {this.databaseEncryptionFormRender}
          </Formik>
        </Modal>
      </>
    );
  }
};
