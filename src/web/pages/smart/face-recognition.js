const React = require('react');
const {Link} = require('capybara-router');
const _ = require('../../../languages');
const Base = require('../shared/base');

module.exports = class FaceRecognition extends Base {
  render() {
    return (
      <div className="page-smart">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <nav>
                <ol className="breadcrumb rounded-pill">
                  <li className="breadcrumb-item active">
                    <Link to="/smart/face-recognition">{_('Smart functions')}</Link>
                  </li>
                  <li className="breadcrumb-item">{_('Face recognition')}</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
