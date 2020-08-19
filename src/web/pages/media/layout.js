const classNames = require('classnames');
const React = require('react');
const {RouterView, Link, getRouter} = require('capybara-router');
const Base = require('../shared/base');
const _ = require('../../../languages');
const Loading = require('../../../core/components/loading');

module.exports = class Media extends Base {
  constructor(props) {
    super(props);
    const router = getRouter();

    this.state.currentRouteName = router.currentRoute.name;
    this.$listens.push(
      router.listen('ChangeStart', (action, toState) => {
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
          <h2>{_('Video')}</h2>
          <nav className="nav flex-column">
            <Link
              to="/media/stream"
              title={_('Stream Settings')}
              className={classNames('nav-link', {active: this.state.currentRouteName === 'web.media.stream'})}
            >
              {_('Stream Settings')}
            </Link>
            <Link
              to="/media/hdmi"
              title={_('HDMI')}
              className={classNames('nav-link', {active: this.state.currentRouteName === 'web.media.hdmi'})}
            >
              HDMI
            </Link>
            <Link
              to="/media/rtsp"
              title={_('RTSP')}
              className={classNames('nav-link', {active: this.state.currentRouteName === 'web.media.rtsp'})}
            >
              RTSP
            </Link>
            <Link
              to="/media/word"
              title={_('OSD')}
              className={classNames('nav-link', {active: this.state.currentRouteName === 'web.media.word'})}
            >
              {_('OSD')}
            </Link>
            <Link
              to="/media/privacy-mask"
              title={_('Privacy Mask')}
              className={classNames('nav-link', {active: this.state.currentRouteName === 'web.media.privacy-mask'})}
            >
              {_('Privacy Mask')}
            </Link>
          </nav>
        </div>

        {/* Main content */}
        <RouterView><Loading/></RouterView>
      </>
    );
  }
};
