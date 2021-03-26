const classNames = require('classnames');
const {Link, RouterView, getRouter} = require('@benson.liao/capybara-router');
const React = require('react');
const Base = require('../shared/base');
const Loading = require('../../../core/components/loading');
const i18n = require('../../../i18n').default;

module.exports = class SDCard extends Base {
  constructor(props) {
    super(props);
    const router = getRouter();

    this.state.currentRouteName = router.currentRoute.name;
    this.$listens.push(
      router.listen('ChangeSuccess', (action, toState) => {
        this.setState({currentRouteName: toState.name});
      })
    );
    if (this.state.currentRouteName === 'web.sd-card') {
      setTimeout(() => {
        router.go({name: 'web.sd-card.settings'});
      });
    }
  }

  render() {
    const {currentRouteName} = this.state;
    return (
      <>
        {/* Left menu */}
        <div className="left-menu fixed-top">
          <h2>{i18n.t('navigation.sidebar.sdCardSettings')}</h2>
          <nav className="nav flex-column">
            <Link
              to="/sd-card/settings"
              title={i18n.t('navigation.sidebar.basic')}
              className={classNames('nav-link', {active: currentRouteName === 'web.sd-card.settings'})}
            >
              {i18n.t('navigation.sidebar.basic')}
            </Link>
            <Link
              to="/sd-card/storage"
              title="storage"
              className={classNames('nav-link', {
                active: currentRouteName === 'web.sd-card.storage' ||
                currentRouteName === 'web.sd-card.image' ||
                currentRouteName === 'web.sd-card.video'
              })}
            >
              {i18n.t('navigation.sidebar.storage')}
            </Link>
          </nav>
        </div>

        {/* Main content */}
        <RouterView><Loading/></RouterView>
      </>
    );
  }
};
