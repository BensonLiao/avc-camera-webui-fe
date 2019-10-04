const React = require('react');
const Base = require('../shared/base');

module.exports = class Members extends Base {
  render() {
    return (
      <div className="main-content left-menu-active">
        <div className="page-users bg-white">
          <h2>Members</h2>
        </div>
      </div>
    );
  }
};
