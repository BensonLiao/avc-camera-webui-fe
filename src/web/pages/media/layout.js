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
        this.setState({
          currentRouteName: toState.name
        });
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
          <h2>{_('Multimedia settings')}</h2>
          <nav className="nav flex-column">
            <Link to="/media/stream" title={_('Stream settings')}
              className={classNames('nav-link', {active: this.state.currentRouteName === 'web.media.stream'})}
            >
              {_('Stream settings')}
            </Link>
            <Link to="/media/rtsp" title={_('RTSP settings')}
              className={classNames('nav-link', {active: this.state.currentRouteName === 'web.media.rtsp'})}
            >
              RTSP
            </Link>
            <Link to="/media/word" title={_('Overlay settings')}
              className={classNames('nav-link', {active: this.state.currentRouteName === 'web.media.word'})}
            >
              {_('Text stickers')}
            </Link>
            <Link to="/media/privacy-mask" title={_('Privacy mask settings')}
              className={classNames('nav-link', {active: this.state.currentRouteName === 'web.media.privacy-mask'})}
            >
              {_('Privacy mask')}
            </Link>
            <Link to="/media/audio" title={_('Audio settings')}
              className={classNames('nav-link', {active: this.state.currentRouteName === 'web.media.audio'})}
            >
              {_('Sound settings')}
            </Link>
          </nav>
        </div>

        {/* Main content */}
        <RouterView><Loading/></RouterView>
      </>
    );
  }
};
