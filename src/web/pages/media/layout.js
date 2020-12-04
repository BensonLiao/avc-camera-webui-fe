const classNames = require('classnames');
const React = require('react');
const {RouterView, Link, getRouter} = require('@benson.liao/capybara-router');
const SystemModelName = require('webserver-form-schema/constants/system-model-name');
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
    const {systemInformation: {modelName}} = this.props;
    return (
      <>
        {/* Left menu */}
        <div className="left-menu fixed-top">
          <h2>{i18n.t('navigation.sidebar.videoSettings')}</h2>
          <nav className="nav flex-column">
            <Link
              to="/media/stream"
              title={i18n.t('navigation.sidebar.streams')}
              className={classNames('nav-link', {active: this.state.currentRouteName === 'web.media.stream'})}
            >
              {i18n.t('navigation.sidebar.streams')}
            </Link>
            <Link
              to="/media/rtsp"
              title={i18n.t('navigation.sidebar.rtsp')}
              className={classNames('nav-link', {active: this.state.currentRouteName === 'web.media.rtsp'})}
            >
              {i18n.t('navigation.sidebar.rtsp')}
            </Link>
            {modelName === SystemModelName.md2 && (
              <Link
                to="/media/hdmi"
                title={i18n.t('navigation.sidebar.hdmi')}
                className={classNames('nav-link', {active: this.state.currentRouteName === 'web.media.hdmi'})}
              >
                {i18n.t('navigation.sidebar.hdmi')}
              </Link>
            )}
            <Link
              to="/media/osd"
              title={i18n.t('navigation.sidebar.osd')}
              className={classNames('nav-link', {active: this.state.currentRouteName === 'web.media.osd'})}
            >
              {i18n.t('navigation.sidebar.osd')}
            </Link>
            <Link
              to="/media/privacy-mask"
              title={i18n.t('navigation.sidebar.privacyMask')}
              className={classNames('nav-link', {active: this.state.currentRouteName === 'web.media.privacy-mask'})}
            >
              {i18n.t('navigation.sidebar.privacyMask')}
            </Link>
          </nav>
        </div>

        {/* Main content */}
        <RouterView><Loading/></RouterView>
      </>
    );
  }
};
