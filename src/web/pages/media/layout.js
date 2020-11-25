const classNames = require('classnames');
const React = require('react');
const {RouterView, Link, getRouter} = require('capybara-router');
const Base = require('../shared/base');
const i18n = require('../../../i18n').default;
const Loading = require('../../../core/components/loading');

module.exports = class Media extends Base {
  constructor(props) {
    super(props);
    const router = getRouter();

    this.state.currentRouteName = router.currentRoute.name;
    this.$listens.push(
      router.listen('ChangeSuccess', (action, toState) => {
        this.setState({currentRouteName: toState.name});
      })
    );
    if (this.state.currentRouteName === 'web.media') {
      setTimeout(() => {
        router.go({name: 'web.media.stream'});
      });
    }
  }

  render() {
    return (
      <>
        {/* Left menu */}
        <div className="left-menu fixed-top">
          <h2>{i18n.t('Video Settings')}</h2>
          <nav className="nav flex-column">
            <Link
              to="/media/stream"
              title={i18n.t('Streams')}
              className={classNames('nav-link', {active: this.state.currentRouteName === 'web.media.stream'})}
            >
              {i18n.t('Streams')}
            </Link>
            <Link
              to="/media/rtsp"
              title={i18n.t('RTSP')}
              className={classNames('nav-link', {active: this.state.currentRouteName === 'web.media.rtsp'})}
            >
              RTSP
            </Link>
            <Link
              to="/media/hdmi"
              title={i18n.t('HDMI')}
              className={classNames('nav-link', {active: this.state.currentRouteName === 'web.media.hdmi'})}
            >
              HDMI
            </Link>
            <Link
              to="/media/osd"
              title={i18n.t('OSD')}
              className={classNames('nav-link', {active: this.state.currentRouteName === 'web.media.osd'})}
            >
              {i18n.t('OSD')}
            </Link>
            <Link
              to="/media/privacy-mask"
              title={i18n.t('Privacy Mask')}
              className={classNames('nav-link', {active: this.state.currentRouteName === 'web.media.privacy-mask'})}
            >
              {i18n.t('Privacy Mask')}
            </Link>
          </nav>
        </div>

        {/* Main content */}
        <RouterView><Loading/></RouterView>
      </>
    );
  }
};
