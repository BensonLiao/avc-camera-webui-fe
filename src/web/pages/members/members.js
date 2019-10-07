const classNames = require('classnames');
const PropTypes = require('prop-types');
const React = require('react');
const {RouterView, Link} = require('capybara-router');
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

  render() {
    return (
      <>
        <div className="left-menu fixed-top">
          <h2>{_('Members')}</h2>
          <nav className="nav flex-column">
            <Link to="/members" title={_('All members')} className={classNames('nav-link text-size-16 py-3', {active: !this.props.params.group})}>
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
      </>
    );
  }
};
