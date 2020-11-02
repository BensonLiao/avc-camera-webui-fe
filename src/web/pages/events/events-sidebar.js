const classNames = require('classnames');
const {Link, getRouter} = require('capybara-router');
const PropTypes = require('prop-types');
const React = require('react');
const i18n = require('../../../i18n').default;
const Similarity = require('webserver-form-schema/constants/event-filters/similarity');
const RecognitionType = require('webserver-form-schema/constants/event-filters/recognition-type');

module.exports = class EventsSidebar extends React.PureComponent {
  static get propTypes() {
    return {
      params: PropTypes.shape({
        type: PropTypes.oneOf(['face-recognition', 'age-gender', 'humanoid-detection']),
        confidence: PropTypes.oneOfType([
          PropTypes.oneOf(Similarity.all()),
          PropTypes.arrayOf(PropTypes.oneOf(Similarity.all()))
        ]),
        enrollStatus: PropTypes.oneOfType([
          PropTypes.oneOf(RecognitionType.all()),
          PropTypes.arrayOf(PropTypes.oneOf(RecognitionType.all()))
        ])
      }).isRequired,
      authStatus: PropTypes.shape({
        isEnableFaceRecognitionKey: PropTypes.bool.isRequired,
        isEnableAgeGenderKey: PropTypes.bool.isRequired,
        isEnableHumanoidDetectionKey: PropTypes.bool.isRequired
      }).isRequired,
      type: PropTypes.string.isRequired,
      currentRouteName: PropTypes.string.isRequired,
      isApiProcessing: PropTypes.bool.isRequired
    };
  }

  constructor(props) {
    super(props);
    this.currentRoute = getRouter().findRouteByName('web.users.events');
  }

  /**
   * Convert router params to an array.
   * @param {Array<String>|String|null} param
   * @returns {Array<String>}
   */
  convertArrayParams = param => {
    let result = [];

    if (Array.isArray(param)) {
      result = [...param];
    } else if (param) {
      result = [param];
    }

    return result;
  };

  /**
   * Clear filter on user clicks.
   * @param {*} event
   * @returns {void}
   */
  onClickClearFilters = event => {
    event.preventDefault();
    getRouter().go({
      name: this.props.currentRouteName,
      params: {type: this.props.type}
    });
  };

  /**
   * Generate the handler to toggle filter.
   * @param {String} paramKey
   * @param {String} value
   * @returns {Function} The handler.
   */
  toggleFilterHandler = (paramKey, value) => () => {
    const params = this.convertArrayParams(this.props.params[paramKey]);
    const indexOfConfidences = params.indexOf(value);
    localStorage.setItem('inputEndTime', true);

    if (indexOfConfidences >= 0) {
      params.splice(indexOfConfidences, 1);
    } else {
      params.push(value);
    }

    getRouter().go({
      name: this.props.currentRouteName,
      params: {
        ...this.props.params,
        index: undefined,
        [paramKey]: params
      }
    });
  };

  faceRecognitionFilterRender = () => {
    const {params, isApiProcessing} = this.props;
    const confidence = this.convertArrayParams(params.confidence);
    const enrollStatus = this.convertArrayParams(params.enrollStatus);
    const similarityRender = [
      {
        confidence: Similarity.low,
        id: 'input-checkbox-low-similar'
      },
      {
        confidence: Similarity.medium,
        id: 'input-checkbox-medium-similar'
      },
      {
        confidence: Similarity.high,
        id: 'input-checkbox-high-similar'
      }
    ];
    const recognitionTypeRender = [
      {
        status: RecognitionType.registered,
        id: 'input-checkbox-register'
      },
      {
        status: RecognitionType.unknown,
        id: 'input-checkbox-anonymous'
      },
      {
        status: RecognitionType.fake,
        id: 'input-checkbox-fake'
      }
    ];
    return (
      <div className="card-body">
        <span>{i18n.t('Similarity')}</span>
        <div className="checkbox-group mt-3 pl-2">
          {similarityRender.map(item => (
            <div key={item.id} className="form-check mb-3">
              <input
                type="checkbox"
                className="form-check-input"
                id={item.id}
                disabled={isApiProcessing}
                checked={confidence.indexOf(item.confidence) >= 0}
                onChange={this.toggleFilterHandler('confidence', item.confidence)}
              />
              <label className="form-check-label" htmlFor={item.id}>
                {i18n.t(`confidence-${item.confidence}`)}
              </label>
            </div>
          ))}
        </div>
        <span>{i18n.t('Recognition Result')}</span>
        <div className="checkbox-group mt-3 mb-2 pl-2">
          {recognitionTypeRender.map((item, idx) => (
            <div key={item.id} className={classNames('form-check', {'mb-3': idx < recognitionTypeRender.length - 1})}>
              <input
                type="checkbox"
                className="form-check-input"
                id={item.id}
                disabled={isApiProcessing}
                checked={enrollStatus.indexOf(item.status) >= 0}
                onChange={this.toggleFilterHandler('enrollStatus', item.status)}
              />
              <label className="form-check-label" htmlFor={item.id}>
                {i18n.t(`enroll-status-${item.status}`)}
              </label>
            </div>
          ))}
        </div>
      </div>
    );
  };

  render() {
    const {
      authStatus: {isEnableFaceRecognitionKey, isEnableAgeGenderKey, isEnableHumanoidDetectionKey},
      type,
      currentRouteName
    } = this.props;
    return (
      <div className="left-menu fixed-top sub shadow-sm">
        <h2>{i18n.t('Events')}</h2>
        <div className="filter-wrapper">
          <div className="header d-flex justify-content-between align-items-center  text-size-12">
            <span>{i18n.t('Filters')}</span>
            <a className="text-primary font-weight-bold" href="#" onClick={this.onClickClearFilters}>{i18n.t('Clear')}</a>
          </div>
          {/* Facial Filter */}
          {/* AVN only have facial */}
          <div className={classNames('card sub mb-3', {active: type === 'face-recognition' && isEnableFaceRecognitionKey})}>
            <div className="card-header text-truncate">
              {
                isEnableFaceRecognitionKey ? (
                  <a className="text-decoration-none d-flex justify-content-between align-items-center">
                    <span>{i18n.t('Facial Recognition')}</span>
                    {/* Remove arrow until more smart functions are available */}
                    {/* <i className="fas fa-chevron-up"/> */}
                  </a>
                ) : (
                  <a className="text-decoration-none d-flex justify-content-between align-items-center">
                    <span>{i18n.t('Facial Recognition')}</span>
                    <span className="badge badge-danger badge-pill">{i18n.t('Activation Required')}</span>
                    <i className="fas fa-chevron-down"/>
                  </a>
                )
              }
            </div>
            {type === 'face-recognition' && isEnableFaceRecognitionKey && this.faceRecognitionFilterRender()}
          </div>
          {/* Age & Gender Filter */}
          <div className={classNames('card sub mb-3 d-none', {active: type === 'age-gender' && isEnableAgeGenderKey})}>
            <div className="card-header text-truncate">
              {
                isEnableAgeGenderKey ? (
                  <Link
                    to={{
                      name: currentRouteName,
                      params: {type: 'age-gender'}
                    }}
                    className="text-decoration-none d-flex justify-content-between align-items-center"
                  >
                    <span>{i18n.t('Age & Gender')}</span>
                    <i className="fas fa-chevron-down"/>
                  </Link>
                ) : (
                  <a className="text-decoration-none d-flex justify-content-between align-items-center">
                    <span>{i18n.t('Age & Gender')}</span>
                    <span className="badge badge-danger badge-pill">{i18n.t('Activation Required')}</span>
                    <i className="fas fa-chevron-down"/>
                  </a>
                )
              }
            </div>
          </div>
          {/* Human Detection Filter */}
          <div className={classNames('card sub mb-3 d-none', {active: type === 'humanoid-detection' && isEnableHumanoidDetectionKey})}>
            <div className="card-header text-truncate">
              {
                isEnableHumanoidDetectionKey ? (
                  <Link
                    to={{
                      name: currentRouteName,
                      params: {type: 'humanoid-detection'}
                    }}
                    className="text-decoration-none d-flex justify-content-between align-items-center"
                  >
                    <span>{i18n.t('Human Detection')}</span>
                    <i className="fas fa-chevron-down"/>
                  </Link>
                ) : (
                  <a className="text-decoration-none d-flex justify-content-between align-items-center">
                    <span>{i18n.t('Human Detection')}</span>
                    <span className="badge badge-danger badge-pill">{i18n.t('Activation Required')}</span>
                    <i className="fas fa-chevron-down"/>
                  </a>
                )
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
};
