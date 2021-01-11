const React = require('react');
const PropTypes = require('prop-types');
const Base = require('../shared/base');
const i18n = require('../../../i18n').default;
const StreamSetting = require('./stream-setting');
const BreadCrumb = require('../../../core/components/fields/breadcrumb').default;

module.exports = class Stream extends Base {
  static get propTypes() {
    return {
      systemInformation: PropTypes.shape({sensorResolution: PropTypes.number.isRequired}).isRequired,
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
    const {streamSettings, systemInformation} = this.props;
    return (
      <div className="main-content left-menu-active">
        <section className="section-media">
          <div className="container-fluid">
            <div className="row">
              <BreadCrumb
                className="px-0"
                path={[i18n.t('navigation.sidebar.videoSettings'), i18n.t('navigation.sidebar.streams')]}
                routes={['/media/stream']}
              />
              <div className="col-center">
                <div className="card shadow">
                  <StreamSetting streamSettings={streamSettings} systemInformation={systemInformation}/>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
};
