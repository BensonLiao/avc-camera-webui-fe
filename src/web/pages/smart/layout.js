const classNames = require('classnames');
const React = require('react');
const {RouterView, Link, getRouter} = require('@benson.liao/capybara-router');
const Base = require('../shared/base');
const CustomTooltip = require('../../../core/components/tooltip');
const i18n = require('../../../i18n').default;
const Loading = require('../../../core/components/loading');

module.exports = class Smart extends Base {
  constructor(props) {
    super(props);
    const router = getRouter();

    this.state.currentRouteName = router.currentRoute.name;
    this.$listens.push(
      router.listen('ChangeSuccess', (action, toState) => {
        this.setState({currentRouteName: toState.name});
      })
    );
    const {authStatus: {isEnableFaceRecognitionKey}} = this.props;
    window.defaultSmartPageLink = isEnableFaceRecognitionKey ? '/analytic/face-recognition' : '/analytic/motion-detection';
    if (this.state.currentRouteName === 'web.smart') {
      setTimeout(() => {
        router.go({name: isEnableFaceRecognitionKey ? 'web.smart.face-recognition' : 'web.smart.motion-detection'});
      });
    }
  }

  render() {
    const {currentRouteName} = this.state;
    const {authStatus: {isEnableFaceRecognitionKey, isEnableAgeGenderKey, isEnableHumanoidDetectionKey}} = this.props;
    let optionalAttributes = [];
    if (!isEnableFaceRecognitionKey) {
      optionalAttributes.onClick = e => e.preventDefault();
    }

    return (
      <>
        {/* Left menu */}
        <div className="left-menu fixed-top">
          <h2>{i18n.t('navigation.sidebar.analyticsSettings')}</h2>
          <nav className="nav flex-column">
            <CustomTooltip show={!isEnableFaceRecognitionKey} title={i18n.t('analytics.license.activationRequired')}>
              <Link
                to={isEnableFaceRecognitionKey ? '/analytic/face-recognition' : '#'}
                title={i18n.t('navigation.sidebar.facialRecognition')}
                className={classNames('nav-link',
                  {active: currentRouteName === 'web.smart.face-recognition'},
                  {inactive: !isEnableFaceRecognitionKey}
                )}
                {...optionalAttributes}
              >
                {i18n.t('navigation.sidebar.facialRecognition')}
              </Link>
            </CustomTooltip>
            <Link
              to="/analytic/motion-detection"
              title={i18n.t('navigation.sidebar.motionDetection')}
              className={classNames('nav-link', {active: currentRouteName === 'web.smart.motion-detection'})}
            >
              {i18n.t('navigation.sidebar.motionDetection')}
            </Link>
            <div className="accordion" id="accordion-smart-menu">
              <CustomTooltip show={!isEnableHumanoidDetectionKey} title={i18n.t('analytics.license.activationRequired')}>
                <a
                  href={null}
                  data-toggle={isEnableHumanoidDetectionKey && 'collapse'}
                  data-target="#hd-detection"
                  title={i18n.t('navigation.sidebar.humanDetection')}
                  className={classNames(
                    'nav-link collapse show d-flex justify-content-between align-items-center',
                    currentRouteName === 'web.smart.human-detection' ? 'active' : 'collapsed',
                    {inactive: !isEnableHumanoidDetectionKey}
                  )}
                >
                  <span className="text-truncate">{i18n.t('navigation.sidebar.humanDetection')}</span>
                  <i className="fas fa-chevron-up"/>
                </a>
              </CustomTooltip>

              <div
                id="hd-detection"
                className={classNames('collapse', {show: currentRouteName === 'web.smart.human-detection'})}
                data-parent="#accordion-smart-menu"
              >
                <Link
                  to="/analytic/human-detection"
                  title={i18n.t('navigation.sidebar.humanDetection')}
                  className={classNames('nav-link', {active: currentRouteName === 'web.smart.human-detection'})}
                >
                  {i18n.t('navigation.sidebar.settings')}
                </Link>
                <a
                  title="report"
                  className="nav-link d-flex align-items-center"
                  href="/hdreport"
                  target="_blank"
                >
                  {i18n.t('navigation.sidebar.hdReport')}
                  <i className="fas fa-external-link-alt fa-xs ml-3"/>
                </a>
                <a
                  title="hdSetting"
                  className="nav-link d-flex align-items-center"
                  href="/app/com.avc.app.hdservice/"
                  target="_blank"
                >
                  {i18n.t('navigation.sidebar.hdService')}
                  <i className="fas fa-external-link-alt fa-xs ml-3"/>
                </a>
              </div>
              <CustomTooltip show={!isEnableAgeGenderKey} title={i18n.t('analytics.license.activationRequired')}>

                <a
                  href={null}
                  data-toggle={isEnableAgeGenderKey && 'collapse'}
                  data-target="#ag-detection"
                  title={i18n.t('navigation.sidebar.ageGenderDetection')}
                  className={classNames(
                    'nav-link collapse show d-flex justify-content-between align-items-center',
                    currentRouteName === 'web.smart.age-gender-detection' ? 'active' : 'collapsed',
                    {inactive: !isEnableAgeGenderKey}
                  )}
                >
                  <span className="text-truncate">{i18n.t('navigation.sidebar.ageGenderDetection')}</span>
                  <i className="fas fa-chevron-up"/>
                </a>
              </CustomTooltip>

              <div
                id="ag-detection"
                className={classNames('collapse', {show: currentRouteName === 'web.smart.age-gender-detection'})}
                data-parent="#accordion-smart-menu"
              >
                <a
                  title="AG report"
                  className="nav-link d-flex align-items-center"
                  href="/agreport"
                  target="_blank"
                >
                  {i18n.t('navigation.sidebar.agReport')}
                  <i className="fas fa-external-link-alt fa-xs ml-3"/>
                </a>
                <a
                  title="agSetting"
                  className="nav-link d-flex align-items-center"
                  href="/app/com.avc.app.age.gender/"
                  target="_blank"
                >
                  {i18n.t('navigation.sidebar.agService')}
                  <i className="fas fa-external-link-alt fa-xs ml-3"/>
                </a>
              </div>
            </div>
            <Link
              to="/analytic/license"
              title={i18n.t('navigation.sidebar.license')}
              className={classNames('nav-link', {active: currentRouteName === 'web.smart.license'})}
            >
              {i18n.t('navigation.sidebar.license')}
            </Link>
          </nav>
        </div>

        <div className="main-content left-menu-active">
          <RouterView><Loading/></RouterView>
        </div>
      </>
    );
  }
};
