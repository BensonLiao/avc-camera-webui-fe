const classNames = require('classnames');
const PropTypes = require('prop-types');
const React = require('react');
const progress = require('nprogress');
const {RouterView, Link, getRouter} = require('capybara-router');
const Modal = require('react-bootstrap/Modal').default;
const Base = require('../shared/base');
const _ = require('../../../languages');

module.exports = class Members extends Base {
  static get propTypes() {
    return {
      params: PropTypes.shape({
        group: PropTypes.string
      }).isRequired,
      groups: PropTypes.shape({
        items: PropTypes.arrayOf(PropTypes.shape({
          id: PropTypes.number.isRequired,
          name: PropTypes.string.isRequired,
          note: PropTypes.string
        }).isRequired).isRequired
      }).isRequired
    };
  }

  constructor(props) {
    super(props);

    this.state.isShowDeleteGroupModal = false;
    this.state.deleteGroupTarget = null;
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
    this.hideDeleteGroupModal();
  };

  hideDeleteGroupModal = () => {
    this.setState({isShowDeleteGroupModal: false});
  };

  generateChangeFilterHandler = (paramKey, value) => {
    /*
    @param paramKey {String}
    @param value {Any}
      The filter value. Pass null to remove the param.
    @returns {Function}
     */
    return event => {
      const router = getRouter();

      event.preventDefault();
      router.go({
        name: router.currentRoute.name,
        params: {
          ...this.props.params,
          [paramKey]: value === undefined ?
            event.target.value :
            (value == null ? undefined : value)
        }
      });
    };
  };

  render() {
    const groups = this.props.groups.items;

    return (
      <>
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
              <Link to={{name: 'web.members.new-group', params: this.props.params}} className="btn btn-link text-light">
                <i className="fas fa-plus fa-fw fa-lg"/>
              </Link>
            </div>

            {
              groups.map(group => (
                <div key={group.id}
                  className={classNames(
                    'group-item d-flex justify-content-between align-items-center',
                    {active: this.props.params.group === `${group.id}`}
                  )}
                >
                  <a className="w-100 text-truncate" href={`#${group.id}`}
                    onClick={this.generateChangeFilterHandler('group', group.id)}
                  >
                    <i className="far fa-folder fa-fw fa-lg"/>
                    <span className="text-truncate pl-4">{group.name}</span>
                  </a>
                  <button className="btn btn-link btn-delete text-light" type="button"
                    onClick={this.generateShowDeleteGroupModalHandler(group)}
                  >
                    <i className="far fa-trash-alt fa-fw fa-lg"/>
                  </button>
                </div>
              ))
            }

            <h3 className="text-truncate mt-3 mb-4">{_('Database file')}</h3>
            <div className="actions">
              <div className="form-group">
                <button className="btn btn-outline-light btn-block rounded-pill" type="button">
                  {_('Export')}
                </button>
              </div>
              <label className="btn btn-outline-light btn-block rounded-pill font-weight-bold">
                <input type="file" className="d-none" accept=".zip"/>{_('Import')}
              </label>
            </div>
          </div>
        </div>

        <div className="main-content left-menu-active">
          <div className="page-users bg-white">
            <div className="container-fluid">
              <div className="row"/>
            </div>
            <RouterView/>
          </div>
        </div>

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
      </>
    );
  }
};
