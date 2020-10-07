const React = require('react');
const PropTypes = require('prop-types');
const Base = require('../shared/base');
const {default: i18n} = require('../../i18n');
const StreamSetting = require('./stream-setting');
const BreadCrumb = require('../../../core/components/fields/breadcrumb').default;

module.exports = class Stream extends Base {
  static get propTypes() {
    return {
      streamSettings: PropTypes.shape({
        channelA: PropTypes.shape({
          codec: PropTypes.string.isRequired,
          resolution: PropTypes.string.isRequired,
          frameRate: PropTypes.string.isRequired,
          bandwidthManagement: PropTypes.string.isRequired,
          bitRate: PropTypes.string,
          gov: PropTypes.string.isRequired
        }).isRequired,
        channelB: PropTypes.shape({
          codec: PropTypes.string.isRequired,
          resolution: PropTypes.string.isRequired,
          frameRate: PropTypes.string.isRequired,
          bandwidthManagement: PropTypes.string.isRequired,
          bitRate: PropTypes.string,
          gov: PropTypes.string.isRequired,
          quality: PropTypes.string.isRequired
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
              <BreadCrumb
                className="px-0"
                path={[i18n.t('Video'), i18n.t('Stream Settings')]}
                routes={['/media/stream']}
              />
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
