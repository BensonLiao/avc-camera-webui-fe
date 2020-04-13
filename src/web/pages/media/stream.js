const React = require('react');
const PropTypes = require('prop-types');
const {Link} = require('capybara-router');
const Base = require('../shared/base');
const _ = require('../../../languages');
const StreamSetting = require('./stream-setting');

module.exports = class Stream extends Base {
  static get propTypes() {
    return {
      streamSettings: PropTypes.shape({
        channelA: PropTypes.shape({
          format: PropTypes.string.isRequired,
          resolution: PropTypes.string.isRequired,
          frameRate: PropTypes.string.isRequired,
          bandwidthManagement: PropTypes.string.isRequired,
          bitRate: PropTypes.string,
          gov: PropTypes.string.isRequired
        }).isRequired,
        channelB: PropTypes.shape({
          format: PropTypes.string.isRequired,
          resolution: PropTypes.string.isRequired,
          frameRate: PropTypes.string.isRequired,
          bandwidthManagement: PropTypes.string.isRequired,
          bitRate: PropTypes.string,
          gov: PropTypes.string.isRequired
        }).isRequired
      }).isRequired
    };
  }

  render() {
    return (
      <div className="main-content left-menu-active">
        <section className="section-media">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12 px-0">
                <nav>
                  <ol className="breadcrumb rounded-pill">
                    <li className="breadcrumb-item active">
                      <Link to="/media/stream">{_('Video')}</Link>
                    </li>
                    <li className="breadcrumb-item">{_('Stream Settings')}</li>
                  </ol>
                </nav>
              </div>
              <div className="col-center">
                <div className="card shadow">
                  <StreamSetting streamSettings={this.props.streamSettings}/>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
};
